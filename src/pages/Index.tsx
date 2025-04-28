
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IdeaCard from '@/components/IdeaCard';
import { mockIdeas } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { AI_CONFIG, getApiStatus } from '@/services/aiConfig';

const Index = () => {
  // Display only the first 3 ideas on the landing page
  const featuredIdeas = mockIdeas.slice(0, 3);
  const apiStatus = getApiStatus();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* How It Works Section */}
        <HowItWorksSection />
        
        {/* Featured Ideas Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Ideas</h2>
              <p className="text-lg text-muted-foreground">
                Explore our curated selection of innovative ideas, each analyzed by our {AI_CONFIG.provider} AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} showMetrics={true} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/ideas" className="inline-flex items-center text-idea-primary hover:text-idea-secondary font-medium">
                View all ideas
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials/Success Stories Section */}
        <TestimonialsSection />
        
        {/* AI Platform Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border border-border overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 md:p-8">
                    <CardHeader className="p-0 pb-6">
                      <CardTitle className="text-2xl font-bold">AI-Powered Idea Validation</CardTitle>
                      <CardDescription>Powered by {AI_CONFIG.provider} v{AI_CONFIG.version}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-muted-foreground">Success probability prediction</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-muted-foreground">Risk level assessment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-muted-foreground">Expected ROI calculation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-muted-foreground">Market potential analysis</span>
                        </li>
                      </ul>
                      
                      <div className="mt-6 p-3 rounded-md bg-muted flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${apiStatus.status === 'configured' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <p className="text-sm text-muted-foreground">{apiStatus.message}</p>
                      </div>
                    </CardContent>
                  </div>
                  <div className="bg-gradient-to-br from-idea-primary to-idea-secondary text-white p-6 md:p-8 flex items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-4">AI Validation Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-md">
                          <p className="text-sm text-white/80">Success Probability</p>
                          <div className="mt-1 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{ width: '82%' }}></div>
                          </div>
                          <p className="mt-1 text-lg font-bold">82%</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-md">
                          <p className="text-sm text-white/80">Risk Level</p>
                          <p className="mt-3 text-lg font-bold">Medium</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-md">
                          <p className="text-sm text-white/80">Expected ROI</p>
                          <p className="mt-3 text-lg font-bold">35%</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-md">
                          <p className="text-sm text-white/80">Innovation Score</p>
                          <p className="mt-3 text-lg font-bold">8.4/10</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
