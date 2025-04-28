
import { useState } from 'react';
import { AI_CONFIG, isApiConfigured } from '../services/aiConfig';

// Investor analysis result interface
export interface InvestorAnalysisResult {
  successProbability: number;
  expectedROI: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  technicalFeasibility: 'Low' | 'Medium' | 'High';
  marketReadiness: string;
  competitiveAdvantage: number;
  teamAssessment: string;
}

// Mock investor analysis (in a real app this would call an API)
export const mockInvestorAnalysis = (ideaData: any): InvestorAnalysisResult => {
  // This is a mock function that would normally make an API call
  // using AI_CONFIG settings to the selected AI provider
  
  // For demo purposes, we'll generate consistent but semi-random values
  // based on the idea's title length
  const titleLength = ideaData.title?.length || 10;
  const descLength = ideaData.description?.length || 50;
  
  const successProb = Math.min(0.95, Math.max(0.35, (titleLength * descLength % 65) / 100 + 0.55));
  
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (successProb > 0.75) riskLevel = 'Low';
  else if (successProb > 0.5) riskLevel = 'Medium';
  else riskLevel = 'High';
  
  const roi = Math.floor(successProb * 100) + '%';
  
  let feasibility: 'Low' | 'Medium' | 'High';
  if (successProb > 0.8) feasibility = 'High';
  else if (successProb > 0.6) feasibility = 'Medium';
  else feasibility = 'Low';
  
  return {
    successProbability: parseFloat(successProb.toFixed(2)),
    expectedROI: roi,
    riskLevel,
    technicalFeasibility: feasibility,
    marketReadiness: successProb > 0.7 ? 'Ready for deployment' : 'Further validation needed',
    competitiveAdvantage: parseFloat((successProb * 10).toFixed(1)),
    teamAssessment: successProb > 0.65 ? 'Strong potential' : 'Needs strengthening'
  };
};

// Hook for investor analysis
export const useInvestorAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvestorAnalysisResult | null>(null);
  
  const analyzeIdea = async (ideaData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if API is configured
      if (!isApiConfigured()) {
        console.warn('API not configured, using mock data for investor analysis');
      }
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get mock analysis results
      const analysisResult = mockInvestorAnalysis(ideaData);
      setResult(analysisResult);
      
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { analyzeIdea, isLoading, error, result };
};
