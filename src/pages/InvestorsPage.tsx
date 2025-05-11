import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PrimaryButton from '@/components/PrimaryButton';
import { useInvestorAnalysis, InvestorAnalysisResult } from '@/hooks/useInvestorAnalysis';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AI_CONFIG } from '@/services/aiConfig';
import { Loader2 } from 'lucide-react';

// Interfaz para la idea del backend
interface BackendIdea {
  id: string;
  title: string;
  description: string;
  metadata: {
    category: string;
    executionCost: string;
    offerRoyalties: boolean;
    royaltyPercentage: string;
    royaltyTerms: string;
    tokenizeIdea: boolean;
    tokenCount?: string;
    tokenSymbol?: string;
    tokenSaleType?: 'fixed' | 'auction';
    targetMarket?: string;
    potentialRisks?: string;
    problemStatement?: string;
    proposedSolution?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  userId: string;
  creator: {
    id: string;
    username: string;
  };
}

// Interfaz para la idea transformada
interface ExtendedIdea {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  status: 'published' | 'sold' | 'funded';
  seller: { name: string; id?: string; avatar?: string };
  royalties?: { percentage: string; terms: string };
  metrics?: { successProbability: number; expectedROI?: string; riskLevel?: string };
  views: number;
  blockchain?: {
    isTokenized: boolean;
    tokenSymbol?: string;
    tokenCount?: number;
    contractAddress?: string;
    sellerAddress?: string;
    saleType?: 'fixed' | 'auction';
    ideaId?: number;
  };
  metadata?: {
    category: string;
    executionCost: string;
    offerRoyalties: boolean;
    royaltyPercentage: string;
    royaltyTerms: string;
    tokenizeIdea: boolean;
    tokenCount?: string;
    tokenSymbol?: string;
    tokenSaleType?: 'fixed' | 'auction';
    targetMarket?: string;
    potentialRisks?: string;
    problemStatement?: string;
    proposedSolution?: string;
    [key: string]: any;
  };
}

const InvestorsPage = () => {
  const [ideas, setIdeas] = useState<ExtendedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<ExtendedIdea | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { analyzeIdea, isLoading: isAnalysisLoading, result } = useInvestorAnalysis();

  // Mapeo estático UUID -> ideaId
  const UUID_TO_IDEA_ID: Record<string, number> = {
    '8257d40c-56fb-414b-b6bd-46ee082f9356': 6,
    '03ad4b5e-9ffb-408f-9e9a-158b9835e6e4': 1,
    '103e1836-8a61-4e78-a802-01e4347f2a1c': 2,
    '1670b5ed-1889-4c2e-942d-01c8518db9f8': 3,
    '1ef71db8-a323-4e73-b263-2a0cdd3bf891': 4,
  };

  // Obtener ideas del backend
  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('🔍 Fetching ideas from backend...');
        const response = await fetch('https://idealink-backend.diegormdev.site/ideas');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const backendIdeas: BackendIdea[] = await response.json();
        const transformedIdeas = backendIdeas.map((backendIdea) => {
          const ideaId = UUID_TO_IDEA_ID[backendIdea.id] || 0;
          return {
            id: backendIdea.id,
            title: backendIdea.title,
            description: backendIdea.description,
            price: parseFloat(backendIdea.metadata.executionCost) || 0,
            category: backendIdea.metadata.category || 'Uncategorized',
            createdAt: backendIdea.createdAt,
            status: 'published' as 'published' | 'sold' | 'funded',
            seller: {
              name: backendIdea.creator.username,
              id: backendIdea.creator.id,
              avatar: '',
            },
            royalties: backendIdea.metadata.offerRoyalties
              ? {
                  percentage: backendIdea.metadata.royaltyPercentage || '0',
                  terms: backendIdea.metadata.royaltyTerms || 'N/A',
                }
              : undefined,
            metrics: {
 humiliaciónProbability: 0.7,
              expectedROI: '30%',
              riskLevel: 'Medium',
            },
            views: 0,
            blockchain: {
              isTokenized: backendIdea.metadata.tokenizeIdea || false,
              tokenSymbol: backendIdea.metadata.tokenSymbol || undefined,
              tokenCount: backendIdea.metadata.tokenCount ? parseInt(backendIdea.metadata.tokenCount) : undefined,
              contractAddress: '0xaa69443bEf9FBDDcBa4e1cBb3Aa89396609B1655',
              sellerAddress: undefined,
              saleType: backendIdea.metadata.tokenSaleType || 'fixed',
              ideaId,
            },
            metadata: backendIdea.metadata,
          };
        });
        console.log('✅ Ideas transformed:', transformedIdeas);
        setIdeas(transformedIdeas);
        setIsLoading(false);
      } catch (err: any) {
        console.error('❌ Error fetching ideas:', err);
        setError('Failed to load ideas. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const handleViewAnalysis = async (idea: ExtendedIdea) => {
    setSelectedIdea(idea);
    await analyzeIdea(idea);
    setShowAnalysis(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Ideas</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <PrimaryButton onClick={() => window.location.reload()}>Try Again</PrimaryButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Investment Opportunities</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Browse our curated selection of high-potential ideas analyzed by our {AI_CONFIG.provider} AI. 
                Each idea is vetted for investment potential and market readiness.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-green-100 text-green-800 border-green-200">AI Vetted</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Startup Ready</Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">Innovation Focused</Badge>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Growth Potential</Badge>
              </div>
            </div>
          </section>
          
          {/* Ideas Listing */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <Card key={idea.id} className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <Badge variant="outline" className="bg-idea-light text-idea-primary">
                      {idea.category}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {idea.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Investment Potential</p>
                      <Progress value={idea.metrics?.successProbability ? idea.metrics.successProbability * 100 : 70} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Est. ROI</p>
                        <p className="font-semibold">{idea.metrics?.expectedROI || '30%'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Level</p>
                        <p className="font-semibold">{idea.metrics?.riskLevel || 'Medium'}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium">Suggested Investment</p>
                      <p className="text-lg font-bold text-idea-primary">
                        ${(idea.price * 2).toLocaleString()} - ${(idea.price * 4).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <PrimaryButton 
                    onClick={() => handleViewAnalysis(idea)} 
                    isLoading={isAnalysisLoading && selectedIdea?.id === idea.id} 
                    className="w-full"
                  >
                    View Analysis
                  </PrimaryButton>
                </CardFooter>
              </Card>
            ))}
          </section>
        </div>
      </main>
      
      {/* Investment Analysis Dialog */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Investment Analysis</DialogTitle>
            <DialogDescription>
              Powered by {AI_CONFIG.provider} v{AI_CONFIG.version}
            </DialogDescription>
          </DialogHeader>
          
          {result && selectedIdea && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedIdea.title}</h3>
                  <p className="text-muted-foreground">{selectedIdea.category}</p>
                </div>
                <Badge variant={result.riskLevel === 'Low' ? 'outline' : 'secondary'} className={
                  result.riskLevel === 'Low' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : result.riskLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                }>
                  {result.riskLevel} Risk
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Financial Potential</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Probability</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={result.successProbability * 100} className="h-2 flex-1" />
                        <span className="font-medium">{Math.round(result.successProbability * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected ROI</p>
                      <p className="text-xl font-semibold text-idea-primary">{result.expectedROI}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Suggested Investment Range</p>
                      <p className="font-medium">
                        ${(selectedIdea.price * 2).toLocaleString()} - ${(selectedIdea.price * 4).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Technical Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Technical Feasibility</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{result.technicalFeasibility}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Competitive Advantage</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={result.competitiveAdvantage * 10} className="h-2 flex-1" />
                        <span className="font-medium">{result.competitiveAdvantage}/10</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team Assessment</p>
                      <p className="font-medium">{result.teamAssessment}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Readiness</p>
                      <p className="font-medium">{result.marketReadiness}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Time to Market</p>
                      <p className="font-medium">
                        {result.technicalFeasibility === 'High' ? '3-6 months' : 
                          result.technicalFeasibility === 'Medium' ? '6-12 months' : '12+ months'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Market</p>
                      <p className="font-medium line-clamp-3">{selectedIdea.metadata?.targetMarket || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Problem Addressed</p>
                      <p className="font-medium line-clamp-3">{selectedIdea.metadata?.problemStatement || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <PrimaryButton>Contact Founder</PrimaryButton>
                <PrimaryButton variant="outline">Download Full Report</PrimaryButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default InvestorsPage;
