
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { AI_CONFIG } from '@/services/aiConfig';
import { useValidateIdea } from '@/hooks/useValidateIdea';
import { useWallet } from '@/hooks/useWallet';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

const categories = [
  "Technology",
  "E-commerce",
  "Health & Wellness",
  "Education",
  "Finance",
  "Food & Sustainability",
  "PropTech",
  "Travel",
  "Entertainment",
  "Other"
];

const PostIdeaPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    problemStatement: '',
    proposedSolution: '',
    targetMarket: '',
    executionCost: '',
    potentialRisks: '',
    offerRoyalties: false,
    royaltyPercentage: '',
    royaltyTerms: '',
    tokenizeIdea: false,
    tokenCount: '',
    tokenSymbol: '',
    tokenSaleType: 'fixed'
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { validateIdea, isLoading: isValidating, result: validationResult } = useValidateIdea();
  const { isConnected, connectWallet, walletState } = useWallet();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'category', 'shortDescription', 'problemStatement', 'proposedSolution', 'targetMarket'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    
    if (formData.executionCost && isNaN(parseFloat(formData.executionCost))) {
      setError('Execution cost must be a number');
      return false;
    }

    if (formData.offerRoyalties) {
      if (!formData.royaltyPercentage) {
        setError('Please specify the royalty percentage');
        return false;
      }
      if (!formData.royaltyTerms) {
        setError('Please specify the royalty terms');
        return false;
      }
    }

    if (formData.tokenizeIdea) {
      if (!formData.tokenCount || isNaN(parseInt(formData.tokenCount))) {
        setError('Please specify a valid token count');
        return false;
      }
      if (!formData.tokenSymbol) {
        setError('Please specify a token symbol');
        return false;
      }
      if (!isConnected) {
        setError('You must connect your wallet to tokenize your idea');
        return false;
      }
    }
    
    return true;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;
    
    try {
      await validateIdea(formData);
      setShowPreview(true);
    } catch (err) {
      setError('Failed to generate preview');
    }
  };

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder for actual API call
      // Commented out for now, will be connected to backend later
      /*
      const formDataObj = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, String(value));
      });
      
      // Add files if present
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formDataObj.append('files', files[i]);
        }
      }
      
      // If tokenizing, we would connect to the blockchain here
      if (formData.tokenizeIdea) {
        // This would be handled by a smart contract call
        // const contract = walletService.getContractInstance();
        // await contract.createIdea(formData.tokenSymbol, parseInt(formData.tokenCount));
      }
      
      const response = await fetch('/api/submit-idea', {
        method: 'POST',
        body: formDataObj,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit idea');
      }
      
      const data = await response.json();
      */
      
      // For now, just show a success message
      alert('Idea submitted!');
      
      // Redirect to dashboard after successful submission
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Post Your Idea</CardTitle>
              <CardDescription>
                Share your innovative idea with potential buyers and investors.
                Our {AI_CONFIG.provider} AI will analyze its market potential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {showPreview && validationResult ? (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">AI Analysis Preview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-idea-light/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Success Probability</p>
                      <p className="text-xl font-semibold text-idea-primary">
                        {Math.round(validationResult.successProbability * 100)}%
                      </p>
                    </div>
                    <div className="bg-idea-light/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <p className="text-xl font-semibold text-idea-primary">
                        {validationResult.riskLevel}
                      </p>
                    </div>
                    <div className="bg-idea-light/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Expected ROI</p>
                      <p className="text-xl font-semibold text-idea-primary">
                        {validationResult.expectedROI}
                      </p>
                    </div>
                    <div className="bg-idea-light/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Innovation Score</p>
                      <p className="text-xl font-semibold text-idea-primary">
                        {validationResult.innovationScore}/10
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Idea Title *</Label>
                  <Input 
                    id="title"
                    name="title"
                    placeholder="Enter a catchy title for your idea"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea 
                    id="shortDescription"
                    name="shortDescription"
                    placeholder="Summarize your idea in a few sentences"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="problemStatement">Problem Statement *</Label>
                    <Textarea 
                      id="problemStatement"
                      name="problemStatement"
                      placeholder="What problem does your idea solve?"
                      value={formData.problemStatement}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proposedSolution">Proposed Solution *</Label>
                    <Textarea 
                      id="proposedSolution"
                      name="proposedSolution"
                      placeholder="How does your idea solve the problem?"
                      value={formData.proposedSolution}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Target Market *</Label>
                  <Textarea 
                    id="targetMarket"
                    name="targetMarket"
                    placeholder="Who will benefit from your idea? What is the market size?"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="executionCost">Estimated Execution Cost</Label>
                    <Input 
                      id="executionCost"
                      name="executionCost"
                      type="text"
                      placeholder="e.g., 5000"
                      value={formData.executionCost}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter an approximate amount in dollars
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="potentialRisks">Potential Risks</Label>
                    <Textarea 
                      id="potentialRisks"
                      name="potentialRisks"
                      placeholder="What challenges might arise during implementation?"
                      value={formData.potentialRisks}
                      onChange={handleInputChange}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Royalties Section */}
                <div className="space-y-4 border border-border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="offerRoyalties"
                      checked={formData.offerRoyalties}
                      onCheckedChange={(checked) => handleCheckboxChange('offerRoyalties', checked === true)}
                    />
                    <Label htmlFor="offerRoyalties" className="font-medium">
                      Would you like to offer a royalty or participation deal to attract buyers/investors?
                    </Label>
                  </div>
                  
                  {formData.offerRoyalties && (
                    <div className="pl-6 space-y-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="royaltyPercentage">Percentage Offered</Label>
                        <Input 
                          id="royaltyPercentage"
                          name="royaltyPercentage"
                          type="text"
                          placeholder="e.g., 5%, 10%"
                          value={formData.royaltyPercentage}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="royaltyTerms">Basic Conditions</Label>
                        <Textarea 
                          id="royaltyTerms"
                          name="royaltyTerms"
                          placeholder="e.g., 5% of net profits for 3 years"
                          value={formData.royaltyTerms}
                          onChange={handleInputChange}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Tokenize Idea Section */}
                <div className="space-y-4 border border-border rounded-lg p-4 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-5 w-5 text-blue-600" />
                      <Label htmlFor="tokenizeIdea" className="font-medium">
                        Tokenize this idea on-chain
                      </Label>
                    </div>
                    <Switch
                      id="tokenizeIdea"
                      checked={formData.tokenizeIdea}
                      onCheckedChange={(checked) => handleSwitchChange('tokenizeIdea', checked)}
                    />
                  </div>
                  
                  {formData.tokenizeIdea && (
                    <div className="space-y-4 mt-2">
                      {!isConnected ? (
                        <div className="bg-blue-100 p-4 rounded-md">
                          <p className="text-sm text-blue-800 mb-2">
                            You must connect your wallet to tokenize your idea.
                          </p>
                          <PrimaryButton
                            type="button"
                            onClick={handleConnectWallet}
                            variant="secondary"
                            size="sm"
                          >
                            Connect Wallet
                          </PrimaryButton>
                        </div>
                      ) : (
                        <div className="bg-blue-100 p-3 rounded-md">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              Wallet Connected: {walletState.address ? `${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 4)}` : ''}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tokenCount">Number of Tokens to Mint</Label>
                          <Input 
                            id="tokenCount"
                            name="tokenCount"
                            type="text"
                            placeholder="e.g., 1000"
                            value={formData.tokenCount}
                            onChange={handleInputChange}
                            disabled={!isConnected}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tokenSymbol">Token Symbol</Label>
                          <Input 
                            id="tokenSymbol"
                            name="tokenSymbol"
                            type="text"
                            placeholder="e.g., IDEA"
                            value={formData.tokenSymbol}
                            onChange={handleInputChange}
                            maxLength={8}
                            disabled={!isConnected}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Token Sale Option</Label>
                        <RadioGroup
                          value={formData.tokenSaleType}
                          onValueChange={(value) => handleSelectChange('tokenSaleType', value)}
                          className="flex flex-col space-y-2"
                          disabled={!isConnected}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <Label htmlFor="fixed">Fixed Price</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="auction" id="auction" />
                            <Label htmlFor="auction">Auction</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-md">
                        <p className="font-medium mb-1">What happens when you tokenize an idea?</p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          <li>Your idea will be registered on the blockchain with a unique identifier</li>
                          <li>Investors can purchase tokens representing partial ownership</li>
                          <li>Smart contracts will manage royalty distributions automatically</li>
                          <li>The provenance and ownership history will be transparent and verifiable</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="files">Upload Sketches or Images (Optional)</Label>
                  <Input 
                    id="files"
                    type="file"
                    className="cursor-pointer"
                    onChange={handleFileChange}
                    multiple
                  />
                  <p className="text-sm text-muted-foreground">
                    You can upload multiple files (max 5MB per file)
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-end space-x-3 pt-4">
                  <SecondaryButton 
                    type="button" 
                    onClick={handlePreview}
                    isLoading={isValidating}
                    disabled={isLoading}
                  >
                    {showPreview ? 'Update Preview' : 'Generate AI Preview'}
                  </SecondaryButton>
                  
                  <PrimaryButton 
                    type="submit" 
                    isLoading={isLoading}
                  >
                    Submit Idea
                  </PrimaryButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PostIdeaPage;
