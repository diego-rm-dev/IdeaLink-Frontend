
import { useState } from 'react';
import { AI_CONFIG, isApiConfigured } from '../services/aiConfig';

// Idea validation response interface
export interface IdeaValidationResult {
  successProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedROI: string;
  innovationScore?: number;
  marketPotential?: number;
  executionComplexity?: number;
}

// Mock idea validation (in a real app this would call an API)
export const mockValidateIdea = (ideaData: any): IdeaValidationResult => {
  // This is a mock function that would normally make an API call
  // using AI_CONFIG settings to the selected AI provider
  
  // For demo purposes, we'll generate consistent but semi-random values
  // based on the idea's title length
  const titleLength = ideaData.title?.length || 10;
  const descLength = ideaData.description?.length || 50;
  
  const successProb = Math.min(0.95, Math.max(0.35, (titleLength * descLength % 65) / 100 + 0.4));
  
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (successProb > 0.75) riskLevel = 'Low';
  else if (successProb > 0.5) riskLevel = 'Medium';
  else riskLevel = 'High';
  
  const roi = Math.floor(successProb * 100) + '%';
  
  return {
    successProbability: parseFloat(successProb.toFixed(2)),
    riskLevel,
    expectedROI: roi,
    innovationScore: parseFloat((successProb * 10).toFixed(1)),
    marketPotential: parseFloat(((successProb + 0.2) * 10).toFixed(1)),
    executionComplexity: parseFloat(((1 - successProb) * 10).toFixed(1))
  };
};

// Hook for validating ideas
export const useValidateIdea = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdeaValidationResult | null>(null);
  
  const validateIdea = async (ideaData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if API is configured
      if (!isApiConfigured()) {
        console.warn('API not configured, using mock data');
      }
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get mock validation results
      const validationResult = mockValidateIdea(ideaData);
      setResult(validationResult);
      
      return validationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { validateIdea, isLoading, error, result };
};
