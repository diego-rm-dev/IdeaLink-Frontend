
// Central AI configuration service that can be swapped without touching the rest of the codebase

export const AI_CONFIG = {
  provider: 'GeminiFlash',
  version: '1.5',
  apiKey: import.meta.env.VITE_IA_API_KEY || '',
  endpoint: import.meta.env.VITE_IA_API_ENDPOINT || ''
};

// Helper function to check if API key is configured
export const isApiConfigured = (): boolean => {
  return !!AI_CONFIG.apiKey && !!AI_CONFIG.endpoint;
};

// Helper to get API status message for UI
export const getApiStatus = (): { status: 'configured' | 'missing'; message: string } => {
  if (isApiConfigured()) {
    return { 
      status: 'configured', 
      message: `Connected to ${AI_CONFIG.provider} v${AI_CONFIG.version}`
    };
  }
  
  return {
    status: 'missing',
    message: 'API not configured. Set VITE_IA_API_KEY and VITE_IA_API_ENDPOINT.'
  };
};
