
# IdeaLink: AI-Powered Idea Marketplace

IdeaLink is a platform where entrepreneurs can sell their business ideas, inventors can find buyers for their innovations, and investors can discover promising opportunities - all validated by AI insights.

## Overview

**IdeaLink** connects:
- **Creators** who have ideas but may lack the resources to execute
- **Buyers** who are looking for validated ideas to implement
- **Investors** who want to fund promising concepts with validated potential

The platform is powered by AI technology that analyzes each idea and provides metrics on success probability, risk level, and expected ROI.

## Features

- Browse and search through a marketplace of ideas
- View AI-generated analytics for each idea
- Buy ideas outright or invest in their development
- Seller dashboard for managing idea listings
- Buyer/Investor dashboard for tracking opportunities
- **NEW! AI Idea Generator** for creating unique business concepts

## Getting Started

### Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

### Configuration

The application uses environment variables for AI service configuration:

1. Create a `.env` file in the root directory with the following variables:
```
VITE_IA_API_KEY=your_api_key_here
VITE_IA_API_ENDPOINT=https://api.yourservice.com/endpoint
```

2. If you don't have API credentials yet, the app will use mock data for demo purposes.

## AI Configuration

The AI configuration is centralized in `src/services/aiConfig.ts`. To switch AI providers or versions in the future:

1. Open `src/services/aiConfig.ts`
2. Update the `AI_CONFIG` object:
```typescript
export const AI_CONFIG = {
  provider: 'YourNewProvider',  // Change the AI provider name
  version: '2.0',               // Update the version
  apiKey: import.meta.env.VITE_IA_API_KEY || '',
  endpoint: import.meta.env.VITE_IA_API_ENDPOINT || ''
};
```

### Idea Generator Configuration

The Idea Generator feature uses the same AI configuration as the rest of the application. To set it up:

1. Ensure your `VITE_IA_API_KEY` and `VITE_IA_API_ENDPOINT` environment variables are configured
2. The Idea Generator will automatically use these credentials to connect to the AI service

For production deployments, you can optionally forward user prompts to a backend API:

1. Open `src/services/ideaGeneratorService.ts`
2. Uncomment the backend API code and modify it to fit your backend implementation:
```javascript
// Optionally forward prompt to a backend endpoint
const backendResponse = await fetch('/api/generate-idea', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt })
});
return await backendResponse.json();
```

## Tech Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
