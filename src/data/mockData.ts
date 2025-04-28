
// Mock data for the IdeaLink MVP

// User types
export type UserRole = 'seller' | 'buyer' | 'investor' | 'admin';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// Idea status
export type IdeaStatus = 'draft' | 'published' | 'sold' | 'funded';

// Import the validation result interface
import { IdeaValidationResult } from '../hooks/useValidateIdea';

// Idea interface
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: IdeaStatus;
  price: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  views: number;
  metrics?: IdeaValidationResult;
}

// Testimonial interface
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  avatar: string;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    role: 'seller',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user2',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    role: 'buyer',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'user3',
    name: 'Robert Chen',
    email: 'robert@example.com',
    role: 'investor',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
];

// Mock ideas
export const mockIdeas: Idea[] = [
  {
    id: 'idea1',
    title: 'AI-Powered Personal Shopping Assistant',
    description: 'A mobile app that uses AI to analyze user preferences and provide personalized shopping recommendations across multiple retailers.',
    category: 'E-commerce',
    status: 'published',
    price: 2500,
    seller: {
      id: 'user1',
      name: 'Alex Thompson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    createdAt: '2023-04-15',
    views: 345,
    metrics: {
      successProbability: 0.82,
      riskLevel: 'Medium',
      expectedROI: '35%',
      innovationScore: 7.5,
      marketPotential: 8.2,
      executionComplexity: 6.3
    },
  },
  {
    id: 'idea2',
    title: 'Sustainable Food Delivery Network',
    description: 'A platform connecting local farmers with urban consumers for sustainable, zero-waste food delivery using reusable packaging.',
    category: 'Food & Sustainability',
    status: 'published',
    price: 3800,
    seller: {
      id: 'user1',
      name: 'Alex Thompson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    createdAt: '2023-05-22',
    views: 218,
    metrics: {
      successProbability: 0.75,
      riskLevel: 'Medium',
      expectedROI: '28%',
      innovationScore: 6.8,
      marketPotential: 7.5,
      executionComplexity: 5.4
    },
  },
  {
    id: 'idea3',
    title: 'AR Home Renovation Visualizer',
    description: 'An AR app that allows homeowners to visualize renovation projects in real-time before committing to contractors or purchases.',
    category: 'PropTech',
    status: 'published',
    price: 5000,
    seller: {
      id: 'user2',
      name: 'Jane Cooper',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    createdAt: '2023-06-05',
    views: 492,
    metrics: {
      successProbability: 0.91,
      riskLevel: 'Low',
      expectedROI: '42%',
      innovationScore: 8.7,
      marketPotential: 9.1,
      executionComplexity: 4.2
    },
  },
  {
    id: 'idea4',
    title: 'Microlearning Platform for Professional Skills',
    description: 'A platform offering bite-sized, AI-tailored learning modules for professionals looking to acquire new skills in just 5 minutes per day.',
    category: 'Education',
    status: 'sold',
    price: 7500,
    seller: {
      id: 'user3',
      name: 'Robert Chen',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    createdAt: '2023-03-10',
    views: 871,
    metrics: {
      successProbability: 0.88,
      riskLevel: 'Low',
      expectedROI: '40%',
      innovationScore: 8.2,
      marketPotential: 8.8,
      executionComplexity: 3.8
    },
  },
  {
    id: 'idea5',
    title: 'Mental Health Check-in Chatbot',
    description: 'An AI-powered chatbot that conducts regular mental health check-ins for employees and provides personalized wellness resources.',
    category: 'Health & Wellness',
    status: 'funded',
    price: 3200,
    seller: {
      id: 'user2',
      name: 'Jane Cooper',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    createdAt: '2023-07-18',
    views: 623,
    metrics: {
      successProbability: 0.79,
      riskLevel: 'Medium',
      expectedROI: '33%',
      innovationScore: 7.4,
      marketPotential: 8.0,
      executionComplexity: 6.1
    },
  },
];

// Mock testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Michael Johnson',
    role: 'CEO',
    company: 'TechStart Ventures',
    message: 'We acquired a brilliant fintech idea through IdeaLink that became our flagship product within 6 months, generating over $2M in revenue.',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 't2',
    name: 'Sarah Williams',
    role: 'Entrepreneur',
    company: 'GreenLife Solutions',
    message: 'I sold my sustainability concept on IdeaLink for 3x what I expected. The AI metrics helped me understand its true market value.',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 't3',
    name: 'David Rodriguez',
    role: 'Angel Investor',
    company: 'Future Fund',
    message: 'IdeaLink\'s AI analytics have helped me identify promising ideas with high success probability. My portfolio ROI has increased by 28%.',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

// Export default logged in user for demo
export const currentUser: User = mockUsers[0];
