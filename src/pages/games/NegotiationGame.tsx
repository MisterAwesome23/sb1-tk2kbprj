import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import { 
  initializeNegotiationGame, 
  calculateAIResponse, 
  evaluateNegotiationSkills,
  calculateFinalScore,
  saveGameResult
} from '../../services/gameService';
import { NegotiationGameState } from '../../types';
import { NEGOTIATION_GAME } from '../../lib/constants';
import { 
  Clock, 
  DollarSign, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  BarChart, 
  RefreshCw,
  Award,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';

export function NegotiationGame() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [gameState, setGameState] = useState<NegotiationGameState>(initializeNegotiationGame());
  const [playerInput, setPlayerInput] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please sign in to play games');
      navigate('/login', { state: { from: '/games/negotiation' } });
    }
  }, [user, loading, navigate]);

  // Initialize timer
  useEffect(() => {
    if (gameState.status === 'in-progress') {
      timerRef.current = setInterval(() => {
        setGameState(prevState => {
          if (prevState.timeRemaining <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            
            // Evaluate skills and calculate score
            const skillAssessment = evaluateNegotiationSkills(prevState);
            const finalScore = calculateFinalScore(skillAssessment);
            
            return {
              ...prevState,
              timeRemaining: 0,
              status: 'timeout',
              skillAssessment,
              finalScore
            };
          }
          return {
            ...prevState,
            timeRemaining: prevState.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.status]);

  // Handle player offer submission
  const handleSubmitOffer = () => {
    const offer = parseInt(playerInput);
    if (isNaN(offer) || offer < NEGOTIATION_GAME.MIN_OFFER || offer > NEGOTIATION_GAME.MAX_OFFER) {
      return;
    }

    // Update game state with player's offer
    const updatedState = { ...gameState };
    updatedState.playerOffer = offer;
    
    // AI response
    const aiResponse = calculateAIResponse(offer, gameState.round, gameState.history);
    updatedState.aiOffer = aiResponse;
    
    // Record history
    const accepted = Math.abs(offer - aiResponse) < 1000 || gameState.round === NEGOTIATION_GAME.ROUNDS;
    updatedState.history.push({
      round: gameState.round,
      playerOffer: offer,
      aiOffer: aiResponse,
      accepted
    });
    
    // Check if game should end
    if (accepted || gameState.round === NEGOTIATION_GAME.ROUNDS) {
      // Game completed - evaluate skills
      const skillAssessment = evaluateNegotiationSkills(updatedState);
      const finalScore = calculateFinalScore(skillAssessment);
      
      updatedState.status = 'completed';
      updatedState.skillAssessment = skillAssessment;
      updatedState.finalScore = finalScore;
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      // Move to next round
      updatedState.round += 1;
    }
    
    setGameState(updatedState);
    setPlayerInput('');
  };

  // Handle saving game results
  const handleSaveResults = async () => {
    if (!user || !gameState.finalScore) return;
    
    setSavingResult(true);
    try {
      await saveGameResult('negotiation', gameState.finalScore, {
        rounds: gameState.history.length,
        finalOffer: gameState.history[gameState.history.length - 1]?.playerOffer,
        accepted: gameState.history[gameState.history.length - 1]?.accepted,
        skillAssessment: gameState.skillAssessment
      });
      setShowResults(true);
      toast.success('Game results saved successfully!');
    } catch (error) {
      console.error('Error saving game result:', error);
      toast.error('Failed to save game results');
    } finally {
      setSavingResult(false);
    }
  };

  // Reset the game
  const handleResetGame = () => {
    setGameState(initializeNegotiationGame());
    setPlayerInput('');
    setShowResults(false);
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <button
          onClick={() => navigate('/games')}
          className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Games
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Negotiation Game
          </h1>
          <p className="text-gray-600">
            Test your negotiation skills by making offers and counter-offers
          </p>
        </div>

        {gameState.status === 'in-progress' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-lg font-semibold">Round {gameState.round}/{NEGOTIATION_GAME.ROUNDS}</span>
              </div>
              <div className="flex items-center text-red-500">
                <Clock className="w-5 h-5 mr-1" />
                <span className="font-mono">{formatTime(gameState.timeRemaining)}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">AI's Offer:</span>
                <span className="text-xl font-bold">${gameState.aiOffer.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${(gameState.aiOffer / NEGOTIATION_GAME.MAX_OFFER) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="playerOffer" className="block text-sm font-medium text-gray-700 mb-1">
                Your Counter-Offer:
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="playerOffer"
                    min={NEGOTIATION_GAME.MIN_OFFER}
                    max={NEGOTIATION_GAME.MAX_OFFER}
                    value={playerInput}
                    onChange={(e) => setPlayerInput(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your offer"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
                <button
                  onClick={handleSubmitOffer}
                  disabled={!playerInput}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Valid range: ${NEGOTIATION_GAME.MIN_OFFER.toLocaleString()} - ${NEGOTIATION_GAME.MAX_OFFER.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Negotiation History:</h3>
              {gameState.history.length === 0 ? (
                <p className="text-sm text-gray-500">No offers made yet. Make your first offer!</p>
              ) : (
                <ul className="space-y-2">
                  {gameState.history.map((record, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>Round {record.round}: You offered ${record.playerOffer.toLocaleString()}</span>
                      <span>AI offered ${record.aiOffer.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {(gameState.status === 'completed' || gameState.status === 'timeout') && !showResults && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="text-center mb-6">
              {gameState.status === 'completed' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Negotiation Complete!</h2>
                  {gameState.history[gameState.history.length - 1]?.accepted ? (
                    <p className="text-gray-600">
                      You successfully reached an agreement at ${gameState.history[gameState.history.length - 1]?.playerOffer.toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      You completed all rounds but didn't reach an agreement.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Time's Up!</h2>
                  <p className="text-gray-600">
                    You ran out of time before completing the negotiation.
                  </p>
                </>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Negotiation Score</h3>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">{gameState.finalScore}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Assessment</h3>
              <div className="space-y-4">
                {gameState.skillAssessment && Object.entries(gameState.skillAssessment).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill}</span>
                      <span className="text-sm font-medium text-gray-900">{score}/100</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleSaveResults}
                disabled={savingResult}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {savingResult ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    Save Results
                  </>
                )}
              </button>
              <button
                onClick={handleResetGame}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Play Again
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Saved!</h2>
              <p className="text-gray-600">
                Your negotiation score has been saved to your profile.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleResetGame}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Play Again
              </button>
              <button
                onClick={() => navigate('/games')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BarChart className="w-4 h-4 mr-2" />
                View All Games
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
          <p className="text-gray-600 mb-4">
            This negotiation game simulates a salary negotiation scenario. You'll make offers and counter-offers with an AI opponent over {NEGOTIATION_GAME.ROUNDS} rounds or until an agreement is reached.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Make offers between ${NEGOTIATION_GAME.MIN_OFFER.toLocaleString()} and ${NEGOTIATION_GAME.MAX_OFFER.toLocaleString()}</li>
            <li>The AI will respond with counter-offers based on your negotiation style</li>
            <li>An agreement is reached when offers are within $1,000 of each other</li>
            <li>You have {NEGOTIATION_GAME.TIME_LIMIT} seconds to complete the negotiation</li>
            <li>Your performance will be evaluated on multiple negotiation skills</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}