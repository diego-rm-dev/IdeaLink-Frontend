
import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { AI_CONFIG } from '@/services/aiConfig';

// Animation CSS for floating elements
const floatingAnimation = {
  animation: 'float 6s ease-in-out infinite',
};

const floatingAnimationSlow = {
  animation: 'float 8s ease-in-out infinite',
};

const floatingAnimationFast = {
  animation: 'float 4s ease-in-out infinite',
};

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236366f1' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-idea-primary/5 rounded-full blur-3xl" style={floatingAnimation}></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-idea-secondary/5 rounded-full blur-3xl" style={floatingAnimationSlow}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-idea-accent/5 rounded-full blur-3xl" style={floatingAnimationFast}></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full px-4 py-1 mb-6 text-sm font-medium bg-idea-light text-idea-primary">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-idea-primary"></span>
              Powered by {AI_CONFIG.provider} {AI_CONFIG.version}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-idea-dark">
              <span className="block">The AI-Powered</span>
              <span className="block bg-gradient-to-r from-idea-primary via-purple-500 to-idea-secondary bg-clip-text text-transparent">
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
                <PrimaryButton size="lg" className="group">
                  Browse Ideas
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </PrimaryButton>
              </Link>
              <Link to="/post-idea">
                <SecondaryButton size="lg">
                  Post Your Idea
                </SecondaryButton>
              </Link>
            </div>
            
            {/* Stats with animation */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <p className="text-3xl font-bold bg-gradient-to-r from-idea-primary to-idea-secondary bg-clip-text text-transparent">500+</p>
                <p className="text-sm text-muted-foreground">Ideas Listed</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <p className="text-3xl font-bold bg-gradient-to-r from-idea-primary to-idea-secondary bg-clip-text text-transparent">$2M+</p>
                <p className="text-sm text-muted-foreground">Transacted</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <p className="text-3xl font-bold bg-gradient-to-r from-idea-primary to-idea-secondary bg-clip-text text-transparent">92%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
          
          {/* Hero illustration - now with 3D effect and animations */}
          <div className="relative h-64 sm:h-80 lg:h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Abstract shape decoration with animations */}
              <div className="absolute w-80 h-80 bg-gradient-to-r from-idea-primary/20 to-purple-300/20 rounded-full blur-3xl" style={floatingAnimationSlow}></div>
              <div className="absolute w-60 h-60 bg-gradient-to-r from-idea-secondary/20 to-pink-200/20 rounded-full blur-3xl -translate-x-20 translate-y-20" style={floatingAnimation}></div>
              
              {/* Main illustration with 3D effect */}
              <div className="relative w-full max-w-md transform perspective-1000 hover:rotate-y-12 transition-transform duration-700">
                <div className="aspect-square bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 group hover:shadow-idea-primary/20 hover:shadow-2xl transition-all duration-500">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-idea-primary to-idea-secondary rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-idea-primary transition-colors duration-300">Smart Home Energy Optimizer</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                        AI system that learns household routines and automatically optimizes energy usage across all connected devices, saving up to 30% on monthly utility bills.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-8">
                      <div className="text-center p-2 bg-idea-light/50 backdrop-blur-sm rounded-md transform hover:scale-105 transition-transform duration-300">
                        <p className="text-xs text-muted-foreground">Success</p>
                        <p className="font-bold text-idea-primary">89%</p>
                      </div>
                      <div className="text-center p-2 bg-idea-light/50 backdrop-blur-sm rounded-md transform hover:scale-105 transition-transform duration-300">
                        <p className="text-xs text-muted-foreground">Risk</p>
                        <p className="font-bold text-idea-primary">Low</p>
                      </div>
                      <div className="text-center p-2 bg-idea-light/50 backdrop-blur-sm rounded-md transform hover:scale-105 transition-transform duration-300">
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="font-bold text-idea-primary">58%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/20 transform hover:-translate-y-1 transition-transform duration-300">
                  <p className="font-bold text-idea-accent">$3,500</p>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-white/20 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-idea-primary to-idea-secondary flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                </div>
                {/* New animated indicators */}
                <div className="absolute -bottom-3 right-10 animate-bounce">
                  <div className="h-6 w-6 rounded-full bg-green-400/80 backdrop-blur-sm flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated particles at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-idea-primary/10 via-transparent to-idea-secondary/10"></div>
      </div>
      
      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
