
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
  };
}

// Extend the Idea interface for blockchain functionality
interface BlockchainIdeaDetails {
  isTokenized: boolean;
  tokenSymbol?: string;
  tokenCount?: number;
  contractAddress?: string;
  sellerAddress?: string;
  saleType?: 'fixed' | 'auction';
}
