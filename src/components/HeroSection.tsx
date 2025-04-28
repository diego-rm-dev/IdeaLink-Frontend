
import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-idea-light to-white opacity-80 z-0"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-idea-dark">
              <span className="block">The AI-Powered</span>
              <span className="block bg-gradient-to-r from-idea-primary to-idea-secondary bg-clip-text text-transparent">
                Idea Marketplace
              </span>
            </h1>
            <p className="mt-6 text-xl text-idea-dark/80 max-w-md">
              Buy, sell, and invest in entrepreneurial ideas with the confidence of AI-driven insights.
            </p>
            <p className="mt-2 text-lg font-medium text-idea-primary italic">
              Where no idea gets left behind.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/ideas">
                <PrimaryButton size="lg">
                  Browse Ideas
                </PrimaryButton>
              </Link>
              <Link to="/dashboard">
                <SecondaryButton size="lg">
                  Post Your Idea
                </SecondaryButton>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-idea-primary">500+</p>
                <p className="text-sm text-muted-foreground">Ideas Listed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-idea-primary">$2M+</p>
                <p className="text-sm text-muted-foreground">Transacted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-idea-primary">92%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
          
          {/* Hero image/illustration */}
          <div className="relative h-64 sm:h-80 lg:h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Abstract shape decoration */}
              <div className="absolute w-80 h-80 bg-idea-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute w-60 h-60 bg-idea-secondary/20 rounded-full blur-3xl -translate-x-20 translate-y-20"></div>
              
              {/* Main illustration - using a simple placeholder for the MVP */}
              <div className="relative w-full max-w-md">
                <div className="aspect-square bg-white rounded-2xl shadow-xl p-8 border border-border">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-idea-primary/10 rounded-lg mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 bg-idea-primary/80 rounded-md"></div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Smart Home Energy Optimizer</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        AI system that learns household routines and automatically optimizes energy usage across all connected devices.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-8">
                      <div className="text-center p-2 bg-idea-light rounded-md">
                        <p className="text-xs text-muted-foreground">Success</p>
                        <p className="font-bold text-idea-primary">89%</p>
                      </div>
                      <div className="text-center p-2 bg-idea-light rounded-md">
                        <p className="text-xs text-muted-foreground">Risk</p>
                        <p className="font-bold text-idea-primary">Low</p>
                      </div>
                      <div className="text-center p-2 bg-idea-light rounded-md">
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="font-bold text-idea-primary">58%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg border border-border">
                  <p className="font-bold text-idea-accent">$3,500</p>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-full shadow-lg border border-border">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-idea-primary to-idea-secondary flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
