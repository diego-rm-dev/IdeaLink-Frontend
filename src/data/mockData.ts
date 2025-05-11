
// Mock data for the IdeaLink application

export interface IdeaMetrics {
  successProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedROI: string;
  innovationScore: number;
  marketPotential: number;
  executionComplexity: number;
}

export interface Royalties {
  percentage: string;
  terms: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  seller: Seller;
  status: 'published' | 'sold' | 'funded';
  createdAt: string;
  views: number;
  metrics?: IdeaMetrics;
  royalties?: Royalties;
}

export interface InvestorAnalysis {
  successProbability: number;
  expectedROI: string;
  riskLevel: string;
  technicalFeasibility: string;
  marketGrowth: string;
  competitiveAdvantage: number;
  timeToMarket: string;
  scoreBreakdown: {
    market: number;
    execution: number;
    innovation: number;
    scalability: number;
  };
}

// Mock sellers
const mockSellers: Seller[] = [
  {
    id: "s1",
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: "s2",
    name: "Maria Garcia",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: "s3",
    name: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: "s4",
    name: "Sarah Wilson",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg"
  }
];

// Mock testimonials data
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  message: string;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Emily Chen",
    role: "Founder",
    company: "GreenTech Solutions",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    message: "IdeaLink helped me find the perfect buyer for my sustainability app concept. The AI validation gave buyers confidence, and I sold my idea for 30% more than I initially expected."
  },
  {
    id: "t2",
    name: "Marcus Jones",
    role: "Investor",
    company: "Venture Capital Partners",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "As an investor, the detailed AI analysis helps me quickly identify promising opportunities. I've funded three ideas through IdeaLink, and two are already moving to production."
  },
  {
    id: "t3",
    name: "Sophia Rodriguez",
    role: "Entrepreneur",
    company: "Streamline Tech",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    message: "I was skeptical at first, but the royalty option allowed me to sell my idea while still benefiting from its success. The buyer implemented my concept exactly as I envisioned."
  }
];

// Mock ideas
export const mockIdeas: Idea[] = [
  {
    id: "idea1",
    title: "AI-Powered Plant Health Monitoring App",
    description: "A mobile application that uses AI to detect plant diseases and nutrient deficiencies by analyzing photos taken by users. The app provides instant diagnostics and treatment recommendations for home gardeners and agricultural professionals.",
    category: "Technology",
    price: 4500,
    seller: mockSellers[0],
    status: "published",
    createdAt: "2025-01-15T12:00:00Z",
    views: 284,
    metrics: {
      successProbability: 0.78,
      riskLevel: "Low",
      expectedROI: "280%",
      innovationScore: 8,
      marketPotential: 9,
      executionComplexity: 6
    },
    royalties: {
      percentage: "5%",
      terms: "5% of net profits for 3 years after purchase"
    }
  },
  {
    id: "idea2",
    title: "Sustainable Packaging Solution for E-commerce",
    description: "A patented biodegradable packaging material made from agricultural waste that is stronger than cardboard, completely waterproof, and biodegrades within 60 days. Perfect for e-commerce businesses looking to reduce environmental impact.",
    category: "Sustainability",
    price: 7800,
    seller: mockSellers[1],
    status: "published",
    createdAt: "2025-02-03T09:30:00Z",
    views: 172,
    metrics: {
      successProbability: 0.85,
      riskLevel: "Medium",
      expectedROI: "190%",
      innovationScore: 9,
      marketPotential: 8,
      executionComplexity: 7
    }
  },
  {
    id: "idea3",
    title: "Smart Home Energy Optimization System",
    description: "An integrated system that combines IoT sensors, machine learning, and smart home technology to automatically optimize energy usage based on occupancy patterns, weather forecasts, and electricity pricing. Can reduce household energy consumption by up to 40%.",
    category: "PropTech",
    price: 12000,
    seller: mockSellers[2],
    status: "sold",
    createdAt: "2025-01-22T15:45:00Z",
    views: 320,
    metrics: {
      successProbability: 0.72,
      riskLevel: "Medium",
      expectedROI: "210%",
      innovationScore: 7,
      marketPotential: 9,
      executionComplexity: 8
    }
  },
  {
    id: "idea4",
    title: "Virtual Reality Physical Therapy Platform",
    description: "A VR-based rehabilitation platform that gamifies physical therapy exercises, providing real-time feedback and progress tracking. The system adapts to individual patient needs and includes remote monitoring capabilities for therapists.",
    category: "Health & Wellness",
    price: 9500,
    seller: mockSellers[3],
    status: "funded",
    createdAt: "2025-02-10T10:15:00Z",
    views: 198,
    metrics: {
      successProbability: 0.81,
      riskLevel: "Low",
      expectedROI: "320%",
      innovationScore: 9,
      marketPotential: 8,
      executionComplexity: 6
    },
    royalties: {
      percentage: "10%",
      terms: "10% royalty on gross revenue for 5 years"
    }
  },
  {
    id: "idea5",
    title: "Blockchain-Based Supply Chain Verification System",
    description: "A turnkey solution for product authenticity and supply chain transparency using blockchain technology. Allows consumers to verify product origins, ethical sourcing, and sustainability metrics by scanning a QR code.",
    category: "Technology",
    price: 15000,
    seller: mockSellers[0],
    status: "published",
    createdAt: "2025-01-05T14:20:00Z",
    views: 245,
    metrics: {
      successProbability: 0.65,
      riskLevel: "High",
      expectedROI: "400%",
      innovationScore: 8,
      marketPotential: 7,
      executionComplexity: 9
    }
  },
  {
    id: "idea6",
    title: "Personalized Nutrition Subscription Service",
    description: "A subscription-based service that combines at-home blood testing, AI analysis, and personalized meal kits to optimize nutrition based on individual biochemistry, fitness goals, and dietary preferences.",
    category: "Food & Sustainability",
    price: 1,
    seller: mockSellers[1],
    status: "published",
    createdAt: "2025-02-18T08:40:00Z",
    views: 156,
    metrics: {
      successProbability: 0.76,
      riskLevel: "Medium",
      expectedROI: "220%",
      innovationScore: 7,
      marketPotential: 8,
      executionComplexity: 7
    },
    royalties: {
      percentage: "8%",
      terms: "8% of profits for first 4 years of operation"
    }
  }
];

// Mock investor analyses
export const mockInvestorAnalyses: Record<string, InvestorAnalysis> = {
  "idea1": {
    successProbability: 0.82,
    expectedROI: "240%",
    riskLevel: "Low",
    technicalFeasibility: "High",
    marketGrowth: "15% annually",
    competitiveAdvantage: 8.5,
    timeToMarket: "6-9 months",
    scoreBreakdown: {
      market: 8.5,
      execution: 7.8,
      innovation: 9.2,
      scalability: 8.7
    }
  },
  "idea2": {
    successProbability: 0.88,
    expectedROI: "210%",
    riskLevel: "Low",
    technicalFeasibility: "Medium",
    marketGrowth: "22% annually",
    competitiveAdvantage: 9.2,
    timeToMarket: "3-6 months",
    scoreBreakdown: {
      market: 9.5,
      execution: 7.1,
      innovation: 9.0,
      scalability: 9.2
    }
  },
  "idea5": {
    successProbability: 0.72,
    expectedROI: "380%",
    riskLevel: "High",
    technicalFeasibility: "Medium",
    marketGrowth: "35% annually",
    competitiveAdvantage: 8.0,
    timeToMarket: "9-12 months",
    scoreBreakdown: {
      market: 8.2,
      execution: 6.5,
      innovation: 8.8,
      scalability: 9.5
    }
  },
  "idea6": {
    successProbability: 0.79,
    expectedROI: "190%",
    riskLevel: "Medium",
    technicalFeasibility: "High",
    marketGrowth: "18% annually",
    competitiveAdvantage: 7.8,
    timeToMarket: "4-8 months",
    scoreBreakdown: {
      market: 7.9,
      execution: 8.2,
      innovation: 7.5,
      scalability: 8.4
    }
  }
};

// Current user for dashboard
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer' | 'investor' | 'admin';
  avatar: string;
  joinedDate: string;
}

export const currentUser: User = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "seller",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  joinedDate: "2024-12-15"
};
