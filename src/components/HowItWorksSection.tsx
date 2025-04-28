
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How IdeaLink Works</h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform connects idea creators with buyers and investors, 
            helping great ideas find the right resources to become reality.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Post your idea */}
          <Card className="border border-border hover:border-idea-primary/20 transition-all duration-300 hover:shadow-md group">
            <CardHeader>
              <div className="w-12 h-12 bg-idea-primary/10 rounded-lg mb-6 flex items-center justify-center group-hover:bg-idea-primary/20 transition-colors">
                <span className="text-idea-primary font-bold text-xl">1</span>
              </div>
              <CardTitle>Post Your Idea</CardTitle>
              <CardDescription>For Idea Creators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Submit your business or product idea with details</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Our AI analyzes and provides success metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Set your price and publish to the marketplace</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Receive payment when a buyer purchases</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Step 2: Buy & Execute */}
          <Card className="border border-border hover:border-idea-primary/20 transition-all duration-300 hover:shadow-md group">
            <CardHeader>
              <div className="w-12 h-12 bg-idea-primary/10 rounded-lg mb-6 flex items-center justify-center group-hover:bg-idea-primary/20 transition-colors">
                <span className="text-idea-primary font-bold text-xl">2</span>
              </div>
              <CardTitle>Buy & Execute</CardTitle>
              <CardDescription>For Buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Browse ideas with verified AI success metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Purchase ideas that match your business goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Receive full documentation and rights transfer</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Execute and build with full ownership</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Step 3: Invest & Scale */}
          <Card className="border border-border hover:border-idea-primary/20 transition-all duration-300 hover:shadow-md group">
            <CardHeader>
              <div className="w-12 h-12 bg-idea-primary/10 rounded-lg mb-6 flex items-center justify-center group-hover:bg-idea-primary/20 transition-colors">
                <span className="text-idea-primary font-bold text-xl">3</span>
              </div>
              <CardTitle>Invest & Scale</CardTitle>
              <CardDescription>For Investors</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Discover high-potential ideas with AI validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Fund promising ideas and get equity stakes</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Partner with creators and buyers for execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-idea-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-muted-foreground">Scale ventures with additional resources</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
