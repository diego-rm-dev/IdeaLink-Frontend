
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockIdeas } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useValidateIdea } from '@/hooks/useValidateIdea';
import { AI_CONFIG } from '@/services/aiConfig';
import { Eye, Calendar, DollarSign, AlertTriangle, Check } from 'lucide-react';

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState(mockIdeas.find(i => i.id === id));
  const { validateIdea, isLoading } = useValidateIdea();
  const [validationResult, setValidationResult] = useState(idea?.metrics);
  
  // If idea is not found in mock data, redirect to 404
  if (!idea) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Idea Not Found</h1>
            <p className="text-muted-foreground mb-6">The idea you're looking for doesn't exist or has been removed.</p>
            <Link to="/ideas">
              <SecondaryButton>Browse All Ideas</SecondaryButton>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'sold': return 'secondary';
      case 'funded': return 'success';
      default: return 'outline';
    }
  };
  
  // Get badge text with first letter capitalized
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(idea.price);
  
  // Format date
  const formattedDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Handle buy click
  const handleBuy = () => {
    alert(`This would initiate the purchase process for idea: ${idea.title}`);
  };
  
  // Handle invest click
  const handleInvest = () => {
    alert(`This would initiate the investment process for idea: ${idea.title}`);
  };
  
  // Trigger validation on load
  useEffect(() => {
    if (idea) {
      validateIdea(idea).then(result => {
        if (result) {
          setValidationResult(result);
        }
      });
    }
  }, [idea]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Navigation breadcrumbs */}
            <div className="flex items-center text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-idea-primary transition-colors">Home</Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <Link to="/ideas" className="text-muted-foreground hover:text-idea-primary transition-colors">Ideas</Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-idea-primary">{idea.title}</span>
            </div>
            
            {/* Idea header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <Badge variant={getBadgeVariant(idea.status) as any} className="mb-4">
                    {getStatusText(idea.status)}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
                  <div className="flex items-center gap-6 text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-idea-primary/5 text-idea-primary">
                        {idea.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{idea.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={idea.seller.avatar} alt={idea.seller.name} />
                      <AvatarFallback>{idea.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      Created by <span className="font-medium">{idea.seller.name}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-bold text-idea-primary mb-2">
                    {formattedPrice}
                  </div>
                  {idea.status === 'published' && (
                    <div className="flex gap-2">
                      <SecondaryButton onClick={handleInvest}>Invest</SecondaryButton>
                      <PrimaryButton onClick={handleBuy}>Buy Now</PrimaryButton>
                    </div>
                  )}
                  {idea.status === 'sold' && (
                    <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Idea already sold</AlertTitle>
                      <AlertDescription>
                        This idea has been purchased and is no longer available.
                      </AlertDescription>
                    </Alert>
                  )}
                  {idea.status === 'funded' && (
                    <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Idea funded</AlertTitle>
                      <AlertDescription>
                        This idea has received investment and is being developed.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
            
            {/* Content tabs */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="market-potential">Market Potential</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Idea Description</h2>
                <p className="text-muted-foreground mb-6">
                  {idea.description}
                </p>
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <h3 className="font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Innovative solution in the {idea.category} space</li>
                    <li>Potential for scalable business model</li>
                    <li>Addresses real market needs with unique approach</li>
                    <li>Technology-driven implementation possible</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-analysis" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">AI Analysis</h2>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Powered by {AI_CONFIG.provider}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Our AI has analyzed this idea based on market trends, potential execution challenges,
                  and historical data from similar ventures. Here are the results:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-idea-primary">
                        {validationResult ? `${(validationResult.successProbability * 100).toFixed(0)}%` : '--'}
                      </CardTitle>
                      <CardDescription>Success Probability</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-idea-primary" 
                          style={{ width: validationResult ? `${validationResult.successProbability * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-idea-primary">
                        {validationResult?.riskLevel || '--'}
                      </CardTitle>
                      <CardDescription>Risk Level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${
                          validationResult?.riskLevel === 'Low' ? 'bg-green-500' : 
                          validationResult?.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-muted-foreground text-sm">
                          {validationResult?.riskLevel === 'Low' ? 'Lower risk than average' : 
                           validationResult?.riskLevel === 'Medium' ? 'Average risk level' : 'Higher than average risk'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-idea-primary">
                        {validationResult?.expectedROI || '--'}
                      </CardTitle>
                      <CardDescription>Expected ROI</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-500" />
                        <span className="text-muted-foreground text-sm">
                          Potential return on investment
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Additional metrics */}
                {validationResult && 'innovationScore' in validationResult && (
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Detailed Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Innovation Score</p>
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-muted rounded-full mr-2">
                            <div 
                              className="h-full bg-purple-500 rounded-full" 
                              style={{ width: `${(validationResult.innovationScore || 0) * 10}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{validationResult.innovationScore}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Market Potential</p>
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-muted rounded-full mr-2">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${(validationResult.marketPotential || 0) * 10}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{validationResult.marketPotential}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Execution Complexity</p>
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-muted rounded-full mr-2">
                            <div 
                              className="h-full bg-orange-500 rounded-full" 
                              style={{ width: `${(validationResult.executionComplexity || 0) * 10}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{validationResult.executionComplexity}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="market-potential" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Market Potential</h2>
                <p className="text-muted-foreground mb-6">
                  Based on current market analysis and trends, this idea shows significant potential in the {idea.category} sector.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Target Market</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Primary demographic: 25-45 year old professionals</li>
                      <li>Urban and suburban markets</li>
                      <li>Tech-savvy early adopters</li>
                      <li>Estimated market size: $2.5B annually</li>
                    </ul>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Competitive Landscape</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>3-5 indirect competitors</li>
                      <li>No direct competitors with the same approach</li>
                      <li>Low barrier to entry but high execution complexity</li>
                      <li>Potential for first-mover advantage</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Growth Projections</h3>
                  <p className="text-muted-foreground mb-4">
                    With proper execution and funding, this idea has the potential for:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Year 1 Revenue</span>
                        <span className="font-medium">$250K - $500K</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Year 3 Revenue</span>
                        <span className="font-medium">$1.2M - $2.5M</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Year 5 Revenue</span>
                        <span className="font-medium">$5M - $10M</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Call to action */}
            {idea.status === 'published' && (
              <div className="bg-idea-primary/5 border border-idea-primary/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold mb-2">Ready to bring this idea to life?</h2>
                <p className="text-muted-foreground mb-6">
                  Purchase this idea now or invest to become a partner in its development.
                </p>
                <div className="flex justify-center gap-4">
                  <SecondaryButton onClick={handleInvest}>Invest in This Idea</SecondaryButton>
                  <PrimaryButton onClick={handleBuy}>Buy For {formattedPrice}</PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IdeaDetailPage;
