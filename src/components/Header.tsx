
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import WalletButton from './WalletButton';
import { Sparkles, MessageCircle, User } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-idea-primary to-idea-secondary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-idea-primary to-idea-secondary bg-clip-text text-transparent">
              IdeaLink
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-idea-primary",
                isActive("/") ? "text-idea-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              to="/ideas" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-idea-primary",
                isActive("/ideas") ? "text-idea-primary" : "text-muted-foreground"
              )}
            >
              Browse Ideas
            </Link>
            <Link 
              to="/investors" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-idea-primary",
                isActive("/investors") ? "text-idea-primary" : "text-muted-foreground"
              )}
            >
              For Investors
            </Link>
            <Link 
              to="/idea-generator"
              className={cn(
                "text-sm font-medium transition-colors hover:text-idea-primary flex items-center gap-1.5",
                isActive("/idea-generator") ? "text-idea-primary" : "text-muted-foreground",
                "relative"
              )}
            >
              Idea Generator
              <Sparkles className="h-3.5 w-3.5 text-idea-accent" />
              <span className="absolute -top-2 -right-8 bg-idea-accent text-white text-[10px] px-1 py-0.5 rounded-full">
                New!
              </span>
            </Link>
            <Link 
              to="/messages" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-idea-primary flex items-center gap-1.5",
                isActive("/messages") ? "text-idea-primary" : "text-muted-foreground"
              )}
            >
              Messages
              <MessageCircle className="h-3.5 w-3.5" />
            </Link>
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Connection */}
            <WalletButton />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link to="/messages">
                  <DropdownMenuItem className="cursor-pointer">
                    Messages
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link to="/login">
                  <DropdownMenuItem className="cursor-pointer">
                    Sign In
                  </DropdownMenuItem>
                </Link>
                <Link to="/register">
                  <DropdownMenuItem className="cursor-pointer">
                    Register
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/post-idea">
              <PrimaryButton size="sm">Post Your Idea</PrimaryButton>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4 8H20M4 16H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-idea-primary px-4 py-2",
                  isActive("/") ? "text-idea-primary bg-idea-light/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/ideas" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-idea-primary px-4 py-2",
                  isActive("/ideas") ? "text-idea-primary bg-idea-light/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Ideas
              </Link>
              <Link 
                to="/investors" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-idea-primary px-4 py-2",
                  isActive("/investors") ? "text-idea-primary bg-idea-light/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Investors
              </Link>
              <Link 
                to="/idea-generator"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-idea-primary px-4 py-2 flex items-center justify-between",
                  isActive("/idea-generator") ? "text-idea-primary bg-idea-light/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Idea Generator
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-idea-accent" />
                  <span className="bg-idea-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    New!
                  </span>
                </div>
              </Link>
              <Link 
                to="/messages" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-idea-primary px-4 py-2 flex items-center justify-between",
                  isActive("/messages") ? "text-idea-primary bg-idea-light/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Messages
                <MessageCircle className="h-3.5 w-3.5" />
              </Link>
              <Link 
                to="/dashboard" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-idea-primary px-4 py-2",
                  isActive("/dashboard") ? "text-idea-primary bg-idea-light/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="px-4 py-2">
                <WalletButton />
              </div>
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <SecondaryButton className="w-full">Sign In</SecondaryButton>
                </Link>
                <Link to="/post-idea" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <PrimaryButton className="w-full">Post Your Idea</PrimaryButton>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
