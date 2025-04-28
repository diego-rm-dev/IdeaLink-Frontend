
import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrimaryButton from '@/components/PrimaryButton';
import { generateIdea } from '@/services/ideaGeneratorService';
import { getApiStatus } from '@/services/aiConfig';

interface GeneratedIdea {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
}

const IdeaGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedIdea[]>([]);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const apiStatus = getApiStatus();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    if (apiStatus.status !== 'configured') {
      toast.error('AI API not configured. Please set environment variables.');
      return;
    }

    setIsGenerating(true);
    setCurrentIdea(null);

    try {
      const response = await generateIdea(prompt);
      
      // Store the new idea
      const newIdea: GeneratedIdea = {
        id: Date.now().toString(),
        prompt,
        response,
        timestamp: new Date()
      };
      
      setCurrentIdea(response);
      setHistory(prev => [newIdea, ...prev]);
      setPrompt('');
      
      toast.success('New idea generated!');
    } catch (error) {
      console.error('Failed to generate idea:', error);
      toast.error('Failed to generate idea. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectFromHistory = (idea: GeneratedIdea) => {
    setCurrentIdea(idea.response);
    promptInputRef.current?.focus();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        {/* Hero Section */}
        <section className="py-12 md:py-16 text-center max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-idea-primary to-idea-secondary bg-clip-text text-transparent">
                Generate Your Next Big Business Idea
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Powered by AI. Unlock powerful, unique business opportunities — digital or physical.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-idea-light to-idea-secondary/20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-idea-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Interactive Area */}
        <section className="max-w-4xl mx-auto grid md:grid-cols-[1fr,300px] gap-6">
          {/* Left side - Input and Results */}
          <div className="space-y-6">
            {/* Input Area */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-medium mb-4">Describe what you're looking for</h2>
              <div className="space-y-4">
                <textarea
                  ref={promptInputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., 'I want an innovative SaaS for small restaurants' or 'Generate a physical product idea for sustainable living'"
                  className="w-full h-32 p-3 rounded-md border border-input bg-background focus:border-idea-primary focus:outline-none focus:ring-1 focus:ring-idea-primary transition-all"
                  disabled={isGenerating}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {apiStatus.status === 'configured' ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {apiStatus.message}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        {apiStatus.message}
                      </span>
                    )}
                  </p>
                  <PrimaryButton 
                    onClick={handleGenerate} 
                    isLoading={isGenerating}
                    disabled={!prompt.trim() || isGenerating}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Generate Idea
                  </PrimaryButton>
                </div>
              </div>
            </div>

            {/* Results Area */}
            {currentIdea && (
              <div className="bg-card rounded-xl p-6 shadow-sm border border-idea-primary/20 transition-all">
                <h2 className="text-xl font-medium mb-4">Your Generated Idea</h2>
                <div className="bg-background rounded-md p-4 border border-border whitespace-pre-wrap">
                  {currentIdea}
                </div>
                <div className="flex justify-end mt-4">
                  <PrimaryButton 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(currentIdea);
                      toast.success('Copied to clipboard!');
                    }}
                  >
                    Copy to clipboard
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - History */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border h-fit">
            <h2 className="text-xl font-medium mb-4">Generation History</h2>
            {history.length === 0 ? (
              <div className="text-muted-foreground text-sm py-4 text-center">
                No history yet. Generate your first idea!
              </div>
            ) : (
              <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {history.map((item) => (
                  <li 
                    key={item.id}
                    onClick={() => selectFromHistory(item)}
                    className="p-3 rounded-md bg-background border border-border cursor-pointer hover:border-idea-primary/50 transition-all"
                  >
                    <p className="font-medium text-sm truncate">{item.prompt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IdeaGeneratorPage;
