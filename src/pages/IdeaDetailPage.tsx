
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
import InvestmentModal from '@/components/InvestmentModal';
import PurchaseModal from '@/components/PurchaseModal';
import { useValidateIdea, IdeaValidationResult } from '@/hooks/useValidateIdea';
import { useWallet } from '@/hooks/useWallet';
import { useMessages } from '@/hooks/useMessages';
import { AI_CONFIG } from '@/services/aiConfig';
import { Eye, Calendar, DollarSign, AlertTriangle, Check, Diamond, Coins, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from '@/hooks/use-toast';

// Extend the Idea interface to include blockchain information
interface ExtendedIdea extends typeof mockIdeas[0] {
  blockchain?: {
    isTokenized: boolean;
    tokenSymbol?: string;
    tokenCount?: number;
    contractAddress?: string;
    sellerAddress?: string;
    saleType?: 'fixed' | 'auction';
  };
}

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  // Mock blockchain data for demonstration
  const mockBlockchainData = {
    isTokenized: id === 'idea2',
    tokenSymbol: 'ECO',
    tokenCount: 1000,
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    sellerAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    saleType: 'fixed' as 'fixed' | 'auction',
  };
  
  const [idea, setIdea] = useState<ExtendedIdea | undefined>(
    mockIdeas.find(i => i.id === id)
  );

  // Add blockchain data to the idea if it's tokenized
  useEffect(() => {
    if (idea && idea.id === 'idea2') {
      setIdea(prev => prev ? { 
        ...prev, 
        blockchain: mockBlockchainData 
      } : undefined);
    }
  }, [id]);
  
  const { validateIdea, isLoading } = useValidateIdea();
  const { isConnected, connectWallet } = useWallet();
  const { startConversation } = useMessages();
  const [validationResult, setValidationResult] = useState<IdeaValidationResult | undefined>(idea?.metrics);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
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
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(idea.price);

  // Handle message click
  const handleMessageSeller = async () => {
    // Start a conversation with the seller
    const newConversation = await startConversation(
      idea.seller.id,
      idea.seller.name,
      idea.seller.avatar
    );
    
    if (newConversation) {
      toast({
        title: "Conversation Started",
        description: `You can now message ${idea.seller.name}`,
      });
      
      // Redirect to messages page with the new conversation
      window.location.href = '/messages';
    }
  };
  
  // Handle invest click
  const handleInvest = () => {
    if (idea.blockchain?.isTokenized && !isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to invest in tokenized ideas",
        variant: "destructive"
      });
      return;
    }
    
    setShowInvestmentModal(true);
  };
  
  // Handle buy click
  const handleBuy = () => {
    if (idea.blockchain?.isTokenized && !isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to buy tokenized ideas",
        variant: "destructive"
      });
      return;
    }
    
    setShowPurchaseModal(true);
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
  
  // Format blockchain address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
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
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={getBadgeVariant(idea.status) as any}>
                      {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                    </Badge>
                    
                    {idea.blockchain?.isTokenized && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
                        <Coins className="h-3 w-3" />
                        <span>Tokenized</span>
                      </Badge>
                    )}
                    
                    {idea.royalties && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5">
                        <Diamond className="h-3 w-3" />
                        <span>Royalties</span>
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
                  <div className="flex items-center gap-6 text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-idea-primary/5 text-idea-primary">
                        {idea.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(idea.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</span>
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
                      {idea.blockchain?.isTokenized && idea.blockchain?.sellerAddress && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({formatAddress(idea.blockchain.sellerAddress)})
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Creator's wallet address</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-4 text-xs flex items-center gap-1"
                      onClick={handleMessageSeller}
                    >
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-bold text-idea-primary mb-2 flex items-center">
                    {formattedPrice}
                    {idea.royalties && (
                      <span className="ml-2 flex items-center text-amber-500 text-base">
                        <Diamond size={16} className="mr-1" />
                        {idea.royalties.percentage}
                      </span>
                    )}
                    {idea.blockchain?.isTokenized && idea.blockchain?.tokenSymbol && (
                      <span className="ml-2 flex items-center text-blue-500 text-base">
                        <Coins size={16} className="mr-1" />
                        {idea.blockchain.tokenSymbol}
                      </span>
                    )}
                  </div>
                  
                  {idea.royalties && (
                    <div className="text-sm text-amber-700 mb-2 bg-amber-50 px-2 py-1 rounded-md">
                      {idea.royalties.terms}
                    </div>
                  )}
                  
                  {idea.blockchain?.isTokenized && (
                    <div className="text-sm text-blue-700 mb-2 bg-blue-50 px-2 py-1 rounded-md flex items-center">
                      {idea.blockchain.tokenCount} tokens available
                    </div>
                  )}
                  
                  {idea.status === 'published' && (
                    <div className="flex gap-2">
                      <SecondaryButton onClick={handleInvest}>
                        {idea.blockchain?.isTokenized ? 'Buy Tokens' : 'Invest'}
                      </SecondaryButton>
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
                {idea.blockchain?.isTokenized && (
                  <TabsTrigger value="blockchain">Blockchain Details</TabsTrigger>
                )}
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
                {validationResult && (
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Detailed Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Innovation Score</p>
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-muted rounded-full mr-2">
                            <div 
                              className="h-full bg-purple-500 rounded-full" 
                              style={{ width: `${validationResult.innovationScore * 10}%` }}
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
                              style={{ width: `${validationResult.marketPotential * 10}%` }}
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
                              style={{ width: `${validationResult.executionComplexity * 10}%` }}
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
              
              {/* New Blockchain Tab */}
              {idea.blockchain?.isTokenized && (
                <TabsContent value="blockchain" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Blockchain Details</h2>
                  <p className="text-muted-foreground mb-6">
                    This idea has been tokenized on the blockchain, providing transparency, security, 
                    and fractional ownership opportunities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-border rounded-lg p-4 bg-blue-50/30">
                      <h3 className="font-medium mb-4 flex items-center">
                        <Coins className="h-5 w-5 mr-2 text-blue-600" />
                        Token Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Token Symbol</p>
                          <p className="font-medium">{idea.blockchain.tokenSymbol}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Supply</p>
                          <p className="font-medium">{idea.blockchain.tokenCount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sale Type</p>
                          <p className="font-medium capitalize">{idea.blockchain.saleType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contract Address</p>
                          <div className="flex items-center">
                            <p className="font-medium font-mono text-sm">{formatAddress(idea.blockchain.contractAddress || '')}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 w-6 p-0"
                              onClick={() => {
                                if (idea.blockchain?.contractAddress) {
                                  navigator.clipboard.writeText(idea.blockchain.contractAddress);
                                  toast({
                                    title: "Address Copied",
                                    description: "Contract address copied to clipboard",
                                  });
                                }
                              }}
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Benefits of Tokenization</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>
                          <span className="font-medium text-black">Fractional Ownership:</span> 
                          <span className="block text-sm">Investors can purchase partial ownership in the idea</span>
                        </li>
                        <li>
                          <span className="font-medium text-black">Transparent Transactions:</span> 
                          <span className="block text-sm">All transactions are recorded on the blockchain</span>
                        </li>
                        <li>
                          <span className="font-medium text-black">Smart Contract Automation:</span> 
                          <span className="block text-sm">Royalty payments and ownership transfers are automated</span>
                        </li>
                        <li>
                          <span className="font-medium text-black">Value Growth:</span> 
                          <span className="block text-sm">Token value can appreciate as the idea gains traction</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 bg-blue-50/20">
                    <h3 className="font-medium mb-2">How to Invest in Tokens</h3>
                    <p className="text-muted-foreground mb-4">
                      To invest in this tokenized idea, connect your Web3 wallet and follow these steps:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-md border border-border">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-2">1</div>
                          <h4 className="font-medium">Connect Wallet</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click the "Connect Wallet" button in the navigation bar
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-border">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-2">2</div>
                          <h4 className="font-medium">Select Amount</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose how many tokens you'd like to purchase
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-border">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-2">3</div>
                          <h4 className="font-medium">Confirm Transaction</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Confirm the purchase in your wallet when prompted
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            {/* Call to action */}
            {idea.status === 'published' && (
              <div className="bg-idea-primary/5 border border-idea-primary/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold mb-2">Ready to bring this idea to life?</h2>
                <p className="text-muted-foreground mb-6">
                  {idea.blockchain?.isTokenized 
                    ? 'Purchase this idea outright or invest in tokens to become a partial owner.'
                    : 'Purchase this idea now or invest to become a partner in its development.'
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {!isConnected && idea.blockchain?.isTokenized ? (
                    <SecondaryButton onClick={connectWallet}>Connect Wallet to Invest</SecondaryButton>
                  ) : (
                    <SecondaryButton onClick={handleInvest}>
                      {idea.blockchain?.isTokenized ? 'Buy Tokens' : 'Invest in This Idea'}
                    </SecondaryButton>
                  )}
                  <PrimaryButton onClick={handleBuy}>Buy For {formattedPrice}</PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Investment Modal */}
      {idea && (
        <InvestmentModal
          idea={idea}
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
        />
      )}
      
      {/* Purchase Modal */}
      {idea && (
        <PurchaseModal
          idea={idea}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default IdeaDetailPage;
