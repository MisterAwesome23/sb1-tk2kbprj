import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { GamepadIcon, RefreshCw, ArrowRight, Book, X, Brain, DollarSign, Trophy, Lock } from 'lucide-react';
import { MBTI_QUESTIONS, PERSONALITY_TYPES, NEGOTIATION_GAME } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { getUserGameResults } from '../services/gameService';
import { toast } from 'react-toastify';

interface Answer {
  questionId: number;
  value: string;
}

export function Games() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMbtiTest, setShowMbtiTest] = useState(false);
  
  // MBTI Test state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [personalityType, setPersonalityType] = useState<string>('');
  const [showAllTypes, setShowAllTypes] = useState(false);

  const progress = ((currentQuestion + 1) / MBTI_QUESTIONS.length) * 100;

  useEffect(() => {
    async function fetchGameResults() {
      if (user) {
        try {
          const results = await getUserGameResults();
          setGameResults(results);
        } catch (error) {
          console.error('Error fetching game results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchGameResults();
  }, [user]);

  const handleStartGame = (gameType: string) => {
    if (!user) {
      toast.error('Please sign in to play games');
      navigate('/login', { state: { from: '/games' } });
      return;
    }

    if (gameType === 'negotiation') {
      navigate('/games/negotiation');
    } else if (gameType === 'mbti') {
      setShowMbtiTest(true);
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: MBTI_QUESTIONS[currentQuestion].id,
      value
    };
    setAnswers(newAnswers);

    if (currentQuestion < MBTI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: Answer[]) => {
    const dimensions = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    finalAnswers.forEach((answer) => {
      dimensions[answer.value as keyof typeof dimensions]++;
    });

    const type = [
      dimensions.E > dimensions.I ? 'E' : 'I',
      dimensions.S > dimensions.N ? 'S' : 'N',
      dimensions.T > dimensions.F ? 'T' : 'F',
      dimensions.J > dimensions.P ? 'J' : 'P'
    ].join('');

    setPersonalityType(type);
    setShowResults(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setPersonalityType('');
    setShowAllTypes(false);
    setShowMbtiTest(false);
  };

  const AllTypesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All MBTI Personality Types</h2>
          <button
            onClick={() => setShowAllTypes(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {Object.entries(PERSONALITY_TYPES).map(([type, info]) => (
            <div key={type} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">
                {type} - {info.name}
              </h3>
              <p className="text-gray-600 mb-3">{info.description}</p>
              <div className="mb-3">
                <h4 className="font-semibold mb-1">Key Characteristics:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {info.characteristics.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Famous People:</h4>
                <p className="text-gray-600">{info.famousPeople.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMbtiTest = () => {
    if (!showResults) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center mb-8">
            <GamepadIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MBTI Personality Test
            </h1>
            <p className="text-gray-600">
              Discover your personality type through this quick assessment
            </p>
          </div>

          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {MBTI_QUESTIONS.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {MBTI_QUESTIONS[currentQuestion].text}
            </h2>
            <div className="space-y-4">
              {MBTI_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className="flex-grow">{option.text}</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">
              Your Personality Type: {personalityType}
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              {PERSONALITY_TYPES[personalityType as keyof typeof PERSONALITY_TYPES]?.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Key Characteristics:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {PERSONALITY_TYPES[personalityType as keyof typeof PERSONALITY_TYPES]?.characteristics.map((trait, index) => (
                <li key={index}>{trait}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Famous People with Your Type:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {PERSONALITY_TYPES[personalityType as keyof typeof PERSONALITY_TYPES]?.famousPeople.map((person, index) => (
                <li key={index}>{person}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setShowAllTypes(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
            >
              <Book className="w-5 h-5 mr-2" />
              View All Personality Types
            </button>
            
            <button
              onClick={resetTest}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Take Test Again
            </button>
          </div>
        </div>
      );
    }
  };

  if (showMbtiTest) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12">
          <button
            onClick={resetTest}
            className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
            Back to Games
          </button>
          {renderMbtiTest()}
          {showAllTypes && <AllTypesModal />}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        <div className="text-center mb-12">
          <GamepadIcon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Assessment Games</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Play these interactive games to discover your workplace strengths and personality traits.
            Your results will help employers find the perfect match for their teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Negotiation Game Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <DollarSign className="w-24 h-24 text-white opacity-75" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Negotiation Game</h2>
                <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Business Skills
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Test your negotiation skills in this interactive simulation. Make offers and counter-offers
                to reach the best possible deal while being evaluated on your strategy and decision-making.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-500">
                    {gameResults.filter(g => g.game_type === 'negotiation').length} plays
                  </span>
                </div>
                <button
                  onClick={() => handleStartGame('negotiation')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {!user && <Lock className="w-4 h-4 mr-2" />}
                  Play Game
                </button>
              </div>
            </div>
          </div>

          {/* MBTI Game Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-24 h-24 text-white opacity-75" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">MBTI Personality Test</h2>
                <div className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Personality
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Discover your Myers-Briggs personality type through this quick assessment. Learn about your
                work style, communication preferences, and how you interact with team members.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-500">
                    {gameResults.filter(g => g.game_type === 'mbti').length} plays
                  </span>
                </div>
                <button
                  onClick={() => handleStartGame('mbti')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  {!user && <Lock className="w-4 h-4 mr-2" />}
                  Take Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Scores Section */}
        {user && gameResults.length > 0 && (
          <div className="mt-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Practice Game Scores</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gameResults.slice(0, 5).map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {result.game_type === 'negotiation' ? (
                            <DollarSign className="w-5 h-5 text-indigo-500 mr-2" />
                          ) : (
                            <Brain className="w-5 h-5 text-purple-500 mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {result.game_type === 'negotiation' ? 'Negotiation Game' : 'MBTI Test'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.score ? `${result.score}/100` : (result.data?.type || 'N/A')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}