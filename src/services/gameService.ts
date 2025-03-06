import { supabase } from '../lib/supabase';
import { GameResult, NegotiationGameState } from '../types';
import { NEGOTIATION_GAME } from '../lib/constants';

export async function saveGameResult(gameType: string, score: number, data?: any) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data: gameData, error } = await supabase
      .from('game_results')
      .insert({
        user_id: userData.user.id,
        game_type: gameType,
        score,
        data
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return gameData as GameResult;
  } catch (error) {
    console.error("Error saving game result:", error);
    
    // For demo purposes, return a mock game result
    return {
      id: `mock-${Date.now()}`,
      user_id: 'mock-user-id',
      game_type: gameType,
      score,
      data,
      created_at: new Date().toISOString()
    } as GameResult;
  }
}

export async function saveMbtiResult(personalityType: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data: gameData, error } = await supabase
      .from('game_results')
      .insert({
        user_id: userData.user.id,
        game_type: 'mbti',
        score: 100, // MBTI doesn't have a numerical score, but we need to store something
        data: { type: personalityType }
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return gameData as GameResult;
  } catch (error) {
    console.error("Error saving MBTI result:", error);
    
    // For demo purposes, return a mock game result
    return {
      id: `mock-${Date.now()}`,
      user_id: 'mock-user-id',
      game_type: 'mbti',
      score: 100,
      data: { type: personalityType },
      created_at: new Date().toISOString()
    } as GameResult;
  }
}

export async function getUserGameResults(gameType?: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('game_results')
      .select('*')
      .eq('user_id', userData.user.id);

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as GameResult[];
  } catch (error) {
    console.error("Error fetching game results:", error);
    
    // For demo purposes, return mock game results
    return [
      {
        id: 'mock-1',
        user_id: 'mock-user-id',
        game_type: 'negotiation',
        score: 85,
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'mock-2',
        user_id: 'mock-user-id',
        game_type: 'mbti',
        score: 100,
        data: { type: 'INTJ' },
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ] as GameResult[];
  }
}

export async function getCandidateGameResults(candidateId: string, gameType?: string) {
  try {
    let query = supabase
      .from('game_results')
      .select('*')
      .eq('user_id', candidateId);

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as GameResult[];
  } catch (error) {
    console.error("Error fetching candidate game results:", error);
    
    // For demo purposes, return empty array
    return [];
  }
}

// Negotiation game logic
export function initializeNegotiationGame(): NegotiationGameState {
  return {
    round: 1,
    playerOffer: 0,
    aiOffer: Math.floor(Math.random() * (NEGOTIATION_GAME.MAX_OFFER - NEGOTIATION_GAME.MIN_OFFER) / 2) + NEGOTIATION_GAME.MIN_OFFER,
    timeRemaining: NEGOTIATION_GAME.TIME_LIMIT,
    history: [],
    status: 'in-progress'
  };
}

export function calculateAIResponse(playerOffer: number, round: number, history: NegotiationGameState['history']): number {
  // AI strategy becomes more aggressive in later rounds
  const roundFactor = round / NEGOTIATION_GAME.ROUNDS;
  const baseOffer = NEGOTIATION_GAME.MIN_OFFER + (NEGOTIATION_GAME.MAX_OFFER - NEGOTIATION_GAME.MIN_OFFER) * (1 - roundFactor * 0.7);
  
  // AI adapts to player's negotiation style
  let adaptiveFactor = 1;
  if (history.length > 0) {
    const playerOfferChanges = history.map(h => h.playerOffer);
    if (playerOfferChanges.length > 1) {
      // If player is making big jumps in offers, AI becomes more conservative
      const avgChange = playerOfferChanges.reduce((acc, val, i, arr) => {
        return i === 0 ? 0 : acc + Math.abs(val - arr[i-1]);
      }, 0) / (playerOfferChanges.length - 1);
      
      adaptiveFactor = avgChange > 1000 ? 0.8 : 1.2;
    }
  }
  
  // AI counter-offer is influenced by player's offer
  const counterOffer = Math.max(
    NEGOTIATION_GAME.MIN_OFFER,
    Math.min(
      NEGOTIATION_GAME.MAX_OFFER,
      baseOffer * adaptiveFactor - (playerOffer * 0.2)
    )
  );
  
  return Math.floor(counterOffer);
}

export function evaluateNegotiationSkills(gameState: NegotiationGameState): Record<string, number> {
  const { history } = gameState;
  
  // Initialize skill scores
  const skills: Record<string, number> = {
    'Value perception': 0,
    'Patience': 0,
    'Risk tolerance': 0,
    'Communication style': 0,
    'Decision making': 0
  };
  
  // Value perception: How well did the player understand the true value range?
  const finalOffer = history[history.length - 1]?.playerOffer || 0;
  const optimalRange = [NEGOTIATION_GAME.MAX_OFFER * 0.6, NEGOTIATION_GAME.MAX_OFFER * 0.8];
  skills['Value perception'] = finalOffer >= optimalRange[0] && finalOffer <= optimalRange[1] ? 
    100 : 100 - (Math.min(Math.abs(finalOffer - optimalRange[0]), Math.abs(finalOffer - optimalRange[1])) / (NEGOTIATION_GAME.MAX_OFFER * 0.2)) * 100;
  
  // Patience: Did the player rush or take time to negotiate?
  skills['Patience'] = Math.min(100, (history.length / NEGOTIATION_GAME.ROUNDS) * 100);
  
  // Risk tolerance: Did the player make bold moves or play it safe?
  const offerChanges = history.map((h, i, arr) => i === 0 ? 0 : Math.abs(h.playerOffer - arr[i-1].playerOffer));
  const avgChange = offerChanges.reduce((sum, val) => sum + val, 0) / (offerChanges.length || 1);
  skills['Risk tolerance'] = Math.min(100, (avgChange / (NEGOTIATION_GAME.MAX_OFFER * 0.1)) * 100);
  
  // Communication style: Consistency in negotiation approach
  const consistency = offerChanges.reduce((std, val) => std + Math.pow(val - avgChange, 2), 0) / (offerChanges.length || 1);
  skills['Communication style'] = 100 - Math.min(100, (consistency / (NEGOTIATION_GAME.MAX_OFFER * 0.05)) * 100);
  
  // Decision making: Quality of final decision
  const finalRound = history[history.length - 1];
  if (finalRound && finalRound.accepted) {
    const dealQuality = finalRound.playerOffer / NEGOTIATION_GAME.MAX_OFFER;
    skills['Decision making'] = dealQuality * 100;
  } else {
    skills['Decision making'] = 0; // No deal was reached
  }
  
  // Ensure all scores are between 0-100 and rounded
  Object.keys(skills).forEach(key => {
    skills[key] = Math.round(Math.max(0, Math.min(100, skills[key])));
  });
  
  return skills;
}

export function calculateFinalScore(skillAssessment: Record<string, number>): number {
  // Weight each skill differently
  const weights = {
    'Value perception': 0.25,
    'Patience': 0.15,
    'Risk tolerance': 0.2,
    'Communication style': 0.15,
    'Decision making': 0.25
  };
  
  // Calculate weighted average
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.entries(skillAssessment).forEach(([skill, score]) => {
    const weight = weights[skill as keyof typeof weights] || 0;
    totalScore += score * weight;
    totalWeight += weight;
  });
  
  return Math.round(totalScore / totalWeight);
}