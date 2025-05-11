import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
import { walletService } from '@/services/walletService';
import { Eye, Calendar, DollarSign, AlertTriangle, Check, Diamond, Coins, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
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
    tokenSaleType?: 'fixed' | 'auction'; // Cambiado de saleType a tokenSaleType
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
export interface ExtendedIdea {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  status: 'published' | 'sold' | 'funded';
  seller: { name: string; id?: string; avatar?: string };
  royalties?: { percentage: string; terms: string };
  metrics?: { successProbability: number };
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
    tokenSaleType?: 'fixed' | 'auction'; // Cambiado de saleType a tokenSaleType
    targetMarket?: string;
    potentialRisks?: string;
    problemStatement?: string;
    proposedSolution?: string;
    [key: string]: any;
  };
}

// Mapeo estático UUID -> ideaId (reemplazar con datos del backend si está disponible)
const UUID_TO_IDEA_ID: Record<string, number> = {
  '8257d40c-56fb-414b-b6bd-46ee082f9356': 6,
  '03ad4b5e-9ffb-408f-9e9a-158b9835e6e4': 1,
  '103e1836-8a61-4e78-a802-01e4347f2a1c': 2,
  '1670b5ed-1889-4c2e-942d-01c8518db9f8': 3,
  '1ef71db8-a323-4e73-b263-2a0cdd3bf891': 4,
};

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<ExtendedIdea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchAndSetAIValidation, isLoading: aiLoading, error: aiError } = useValidateIdea();
  const { isConnected, connectWallet } = useWallet();
  const { startConversation } = useMessages();
  const [validationResult, setValidationResult] = useState<IdeaValidationResult | undefined>(undefined);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [releasableAmount, setReleasableAmount] = useState('0');

  // Obtener detalles de la idea
  useEffect(() => {
    const fetchIdea = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`🔍 Fetching idea with ID: ${id}`);
        // Intentar endpoint específico /ideas/:id
        const response = await fetch(`https://idealink-backend.diegormdev.site/ideas/${id}`);
        if (!response.ok) {
          // Si /ideas/:id no existe, intentar filtrar desde /ideas
          console.warn('⚠️ Endpoint /ideas/:id failed, trying /ideas...');
          const allIdeasResponse = await fetch('https://idealink-backend.diegormdev.site/ideas');
          if (!allIdeasResponse.ok) {
            throw new Error(`HTTP error! status: ${allIdeasResponse.status}`);
          }
          const allIdeas: BackendIdea[] = await allIdeasResponse.json();
          const backendIdea = allIdeas.find((idea) => idea.id === id);
          if (!backendIdea) {
            throw new Error('Idea not found');
          }
          await processIdea(backendIdea);
        } else {
          const backendIdea: BackendIdea = await response.json();
          await processIdea(backendIdea);
        }
      } catch (err: any) {
        console.error('❌ Error fetching idea:', err);
        setError('Failed to load idea. Please try again later.');
        setIsLoading(false);
      }
    };

    const processIdea = async (backendIdea: BackendIdea) => {
      const ideaId = UUID_TO_IDEA_ID[backendIdea.id];
      let status: 'published' | 'sold' | 'funded' = 'published';

      // Consultar estado en el contrato
      if (ideaId) {
        try {
          const contract = walletService.getContractInstance();
          const ideaStatus = await contract.ideas(ideaId);
          status = ideaStatus.owner === '0x0000000000000000000000000000000000000000' ? 'published' : 'sold';
          console.log(`✅ Idea status from contract: ${status}`);
        } catch (contractErr) {
          console.warn('⚠️ Could not fetch status from contract:', contractErr);
        }
      }

      // Transformar datos
      const transformedIdea: ExtendedIdea = {
        id: backendIdea.id,
        title: backendIdea.title,
        description: backendIdea.description,
        price: parseFloat(backendIdea.metadata.executionCost) || 0,
        category: backendIdea.metadata.category || 'Uncategorized',
        createdAt: backendIdea.createdAt,
        status,
        seller: {
          name: backendIdea.creator.username,
          id: backendIdea.creator.id,
          avatar: '', // Añadir avatar si el backend lo proporciona
        },
        royalties: backendIdea.metadata.offerRoyalties
          ? {
              percentage: backendIdea.metadata.royaltyPercentage || '0',
              terms: backendIdea.metadata.royaltyTerms || 'N/A',
            }
          : undefined,
        metrics: { successProbability: 0 },
        views: 0, // Backend no proporciona views
        blockchain: {
          isTokenized: backendIdea.metadata.tokenizeIdea || false,
          tokenSymbol: backendIdea.metadata.tokenSymbol || undefined,
          tokenCount: backendIdea.metadata.tokenCount ? parseInt(backendIdea.metadata.tokenCount) : undefined,
          contractAddress: '0xaa69443bEf9FBDDcBa4e1cBb3Aa89396609B1655', // Actualizar con la dirección real
          sellerAddress: undefined, // Añadir si el backend lo proporciona
          saleType: backendIdea.metadata.tokenSaleType || 'fixed', // Usar tokenSaleType
          ideaId,
        },
        metadata: backendIdea.metadata, // Añadir metadata completo
      };

      console.log('✅ Idea transformed:', transformedIdea);
      setIdea(transformedIdea);
      setIsLoading(false);
    };

    if (id) {
      fetchIdea();
    } else {
      setError('Invalid idea ID');
      setIsLoading(false);
    }
  }, [id]);

  // Manejar wallet y releasableAmount
  useEffect(() => {
    walletService.subscribeToAccountChanges(async (accounts) => {
      const address = accounts[0] || null;
      setWalletAddress(address);
      if (address && id && idea?.blockchain?.ideaId) {
        try {
          const amount = await walletService.getReleasableAmount(idea.blockchain.ideaId, address);
          setReleasableAmount(amount);
          console.log('🔍 Monto liberable actualizado:', amount);
        } catch (error) {
          console.error('❌ Error al obtener monto liberable:', error);
        }
      }
    });

    walletService.subscribeToChainChanges((chainId) => {
      console.log('🔄 Red cambiada a chainId:', chainId);
      if (chainId !== 43113) { // Fuji Testnet
        toast({
          title: 'Red Incorrecta',
          description: 'Por favor cambia a Avalanche Fuji Testnet.',
          variant: 'destructive',
        });
      }
    });

    const checkWallet = async () => {
      if (walletService.isWalletConnected()) {
        const address = await walletService.getWalletAddress();
        if (address && id && idea?.blockchain?.ideaId) {
          setWalletAddress(address);
          try {
            const amount = await walletService.getReleasableAmount(idea.blockchain.ideaId, address);
            setReleasableAmount(amount);
            console.log('🔍 Monto liberable inicial:', amount);
          } catch (error) {
            console.error('❌ Error al obtener monto liberable:', error);
          }
        }
      }
    };
    checkWallet();

    return () => {
      walletService.unsubscribeFromAccountChanges();
      walletService.unsubscribeFromChainChanges();
    };
  }, [id, idea]);

  // Validación AI
  useEffect(() => {
    if (idea) {
      const timeout = setTimeout(() => {
        fetchAndSetAIValidation(idea).then((res) => {
          if (res) {
            setValidationResult(res);
          }
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [idea, fetchAndSetAIValidation]);

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

  if (error || !idea) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Idea No Encontrada</h1>
            <p className="text-muted-foreground mb-6">La idea que buscas no existe o ha sido eliminada.</p>
            <Link to="/ideas">
              <SecondaryButton>Explorar Todas las Ideas</SecondaryButton>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'sold': return 'secondary';
      case 'funded': return 'success';
      default: return 'outline';
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(idea.price);

  const handleMessageSeller = async () => {
    const newConversation = await startConversation(
      idea.seller.id || '',
      idea.seller.name,
      idea.seller.avatar
    );

    if (newConversation) {
      toast({
        title: 'Conversación Iniciada',
        description: `Ahora puedes enviar mensajes a ${idea.seller.name}`,
      });
      window.location.href = '/messages';
    }
  };

  const handleInvest = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Requerido',
        description: 'Por favor conecta tu wallet para invertir.',
        variant: 'destructive',
      });
      return;
    }
    setShowInvestmentModal(true);
  };

  const handleBuy = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Requerido',
        description: 'Por favor conecta tu wallet para comprar.',
        variant: 'destructive',
      });
      return;
    }
    setShowPurchaseModal(true);
  };

  const handleReleaseTokens = async () => {
    if (!isConnected || !id || !walletAddress || !idea.blockchain?.ideaId) {
      toast({
        title: 'Wallet Requerido',
        description: 'Por favor conecta tu wallet para liberar tokens.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('🔓 Iniciando liberación de tokens para idea:', idea.blockchain.ideaId);
      const result = await walletService.releaseTokens(idea.blockchain.ideaId);
      console.log('✅ Tokens liberados:', result);
      toast({
        title: 'Tokens Liberados',
        description: `Has liberado ${result.amount} IDEL.`,
      });
      const amount = await walletService.getReleasableAmount(idea.blockchain.ideaId, walletAddress);
      setReleasableAmount(amount);
      console.log('🔍 Monto liberable actualizado:', amount);
    } catch (error: any) {
      console.error('❌ Error al liberar tokens:', error);
      const errorMessage = error.reason || error.message || 'No se pudieron liberar los tokens.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const formatAddress = (address?: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Función para formatear texto con saltos de línea en una lista
  const formatTextToList = (text?: string) => {
    if (!text) return ['No disponible'];
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-idea-primary transition-colors">Home</Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <Link to="/ideas" className="text-muted-foreground hover:text-idea-primary transition-colors">Ideas</Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-idea-primary">{idea.title}</span>
            </div>
            
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
                      Creado por <span className="font-medium">{idea.seller.name}</span>
                      {idea.blockchain?.sellerAddress && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({formatAddress(idea.blockchain.sellerAddress)})
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Dirección del wallet del creador</p>
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
                      Mensaje
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
                      {idea.blockchain.tokenCount} tokens disponibles
                    </div>
                  )}
                  
                  {idea.status === 'published' && (
                    <div className="flex gap-2">
                      <SecondaryButton onClick={handleInvest} disabled={!isConnected}>
                        {idea.blockchain?.isTokenized ? 'Comprar Tokens' : 'Invertir'}
                      </SecondaryButton>
                      <PrimaryButton onClick={handleBuy} disabled={!isConnected}>
                        Comprar Ahora
                      </PrimaryButton>
                    </div>
                  )}
                  
                  {idea.status === 'sold' && (
                    <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Idea ya vendida</AlertTitle>
                      <AlertDescription>
                        Esta idea ha sido comprada y ya no está disponible.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {idea.status === 'funded' && (
                    <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Idea financiada</AlertTitle>
                      <AlertDescription>
                        Esta idea ha recibido inversión y está en desarrollo.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="description" className="mb-8">
              <TabsList>
                <TabsTrigger value="description">Descripción</TabsTrigger>
                <TabsTrigger value="ai-analysis">Análisis AI</TabsTrigger>
                <TabsTrigger value="market-potential">Potencial de Mercado</TabsTrigger>
                {idea.blockchain?.isTokenized && (
                  <TabsTrigger value="blockchain">Detalles Blockchain</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="description" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Descripción de la Idea</h2>
                <p className="text-muted-foreground mb-6">
                  {idea.description}
                </p>
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <h3 className="font-medium mb-2">Características Clave</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Solución innovadora en el espacio {idea.category}</li>
                    <li>Potencial para un modelo de negocio escalable</li>
                    <li>Aborda necesidades reales del mercado con un enfoque único</li>
                    <li>Implementación impulsada por tecnología posible</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-analysis" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                {aiLoading && (
                  <div className="text-center">
                    <p className="text-muted-foreground">Cargando análisis AI...</p>
                  </div>
                )}
                {aiError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{aiError}</AlertDescription>
                  </Alert>
                )}
                {!aiLoading && !aiError && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Análisis AI</h2>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Desarrollado por {AI_CONFIG.provider}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Nuestra IA ha analizado esta idea basándose en tendencias de mercado, desafíos de ejecución potenciales,
                      y datos históricos de proyectos similares. Aquí están los resultados:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-2xl font-bold text-idea-primary">
                            {validationResult ? `${(validationResult.successProbability * 100).toFixed(0)}%` : '--'}
                          </CardTitle>
                          <CardDescription>Probabilidad de Éxito</CardDescription>
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
                          <CardDescription>Nivel de Riesgo</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              validationResult?.riskLevel === 'Low' ? 'bg-green-500' : 
                              validationResult?.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-muted-foreground text-sm">
                              {validationResult?.riskLevel === 'Low' ? 'Riesgo menor al promedio' : 
                               validationResult?.riskLevel === 'Medium' ? 'Nivel de riesgo promedio' : 'Riesgo mayor al promedio'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-2xl font-bold text-idea-primary">
                            {validationResult?.expectedROI || '--'}
                          </CardTitle>
                          <CardDescription>ROI Esperado</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-500" />
                            <span className="text-muted-foreground text-sm">
                              Retorno potencial sobre la inversión
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    {validationResult && (
                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-4">Métricas Detalladas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Puntaje de Innovación</p>
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
                            <p className="text-sm text-muted-foreground mb-1">Potencial de Mercado</p>
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
                            <p className="text-sm text-muted-foreground mb-1">Complejidad de Ejecución</p>
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
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="market-potential" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Potencial de Mercado</h2>
                <p className="text-muted-foreground mb-6">
                  Basado en análisis de mercado actual y tendencias, esta idea muestra un potencial significativo en el sector {idea.category}.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Mercado Objetivo</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {formatTextToList(idea.metadata?.targetMarket).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Riesgos Potenciales</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {formatTextToList(idea.metadata?.potentialRisks).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Problema y Solución</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>Problema:</strong> {idea.metadata?.problemStatement || 'No disponible'}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Solución:</strong> {idea.metadata?.proposedSolution || 'No disponible'}
                  </p>
                </div>
              </TabsContent>
              
              {idea.blockchain?.isTokenized && (
                <TabsContent value="blockchain" className="bg-white rounded-lg shadow-sm p-6 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Detalles Blockchain</h2>
                  <p className="text-muted-foreground mb-6">
                    Esta idea ha sido tokenizada en la blockchain, proporcionando transparencia, seguridad, 
                    y oportunidades de propiedad fraccionada.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-border rounded-lg p-4 bg-blue-50/30">
                      <h3 className="font-medium mb-4 flex items-center">
                        <Coins className="h-5 w-5 mr-2 text-blue-600" />
                        Información del Token
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Símbolo del Token</p>
                          <p className="font-medium">{idea.blockchain.tokenSymbol || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Suministro Total</p>
                          <p className="font-medium">{idea.blockchain.tokenCount?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Venta</p>
                          <p className="font-medium capitalize">{idea.blockchain.saleType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dirección del Contrato</p>
                          <div className="flex items-center">
                            <p className="font-medium font-mono text-sm">{formatAddress(idea.blockchain.contractAddress)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 w-6 p-0"
                              onClick={() => {
                                if (idea.blockchain?.contractAddress) {
                                  navigator.clipboard.writeText(idea.blockchain.contractAddress);
                                  toast({
                                    title: 'Dirección Copiada',
                                    description: 'Dirección del contrato copiada al portapapeles',
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
                        <div>
                          <p className="text-sm text-muted-foreground">Tokens Liberables</p>
                          <p className="font-medium">{releasableAmount} IDEL</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleReleaseTokens}
                        disabled={releasableAmount === '0' || !isConnected}
                        className="mt-4"
                      >
                        Liberar Tokens
                      </Button>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Beneficios de la Tokenización</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>
                          <span className="font-medium text-black">Propiedad Fraccionada:</span> 
                          <span className="block text-sm">Los inversores pueden comprar propiedad parcial en la idea</span>
                        </li>
                        <li>
                          <span className="font-medium text-black">Transacciones Transparentes:</span> 
                          <span className="block text-sm">Todas las transacciones se registran en la blockchain</span>
                        </li>
                        <li>
                          <span className="font-medium text-black">Automatización de Contratos Inteligentes:</span> 
                          <span className="block text-sm">Pagos de regalías y transferencias de propiedad son automatizados</span>
                        </li>
                        <li>
                          <span className="font-medium text-black">Crecimiento de Valor:</span> 
                          <span className="block text-sm">El valor del token puede apreciarse a medida que la idea gana tracción</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 bg-blue-50/20">
                    <h3 className="font-medium mb-2">Cómo Invertir en Tokens</h3>
                    <p className="text-muted-foreground mb-4">
                      Para invertir en esta idea tokenizada, conecta tu wallet Web3 y sigue estos pasos:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-md border border-border">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-2">1</div>
                          <h4 className="font-medium">Conectar Wallet</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Haz clic en el botón "Conectar Wallet" en la barra de navegación
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-border">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-2">2</div>
                          <h4 className="font-medium">Seleccionar Monto</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Elige cuántos tokens deseas comprar
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-border">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-2">3</div>
                          <h4 className="font-medium">Confirmar Transacción</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Confirma la compra en tu wallet cuando se te solicite
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            {idea.status === 'published' && (
              <div className="bg-idea-primary/5 border border-idea-primary/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold mb-2">¿Listo para dar vida a esta idea?</h2>
                <p className="text-muted-foreground mb-6">
                  {idea.blockchain?.isTokenized 
                    ? 'Compra esta idea directamente o invierte en tokens para convertirte en propietario parcial.'
                    : 'Compra esta idea ahora o invierte para convertirte en socio en su desarrollo.'
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {!isConnected ? (
                    <SecondaryButton onClick={connectWallet}>Conectar Wallet</SecondaryButton>
                  ) : (
                    <SecondaryButton onClick={handleInvest}>
                      {idea.blockchain?.isTokenized ? 'Comprar Tokens' : 'Invertir en Esta Idea'}
                    </SecondaryButton>
                  )}
                  <PrimaryButton onClick={handleBuy} disabled={!isConnected}>
                    Comprar por {formattedPrice}
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {idea && (
        <InvestmentModal
          idea={idea}
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
        />
      )}
      
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
