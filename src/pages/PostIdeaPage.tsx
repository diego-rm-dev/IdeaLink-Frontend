
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
import { AI_CONFIG } from '@/services/aiConfig';
import { useValidateIdea } from '@/hooks/useValidateIdea';

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
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { validateIdea, isLoading: isValidating, result: validationResult } = useValidateIdea();

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

                {/* New Royalties Section */}
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
