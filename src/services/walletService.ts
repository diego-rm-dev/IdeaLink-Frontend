
import { ethers } from 'ethers';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
}

// Placeholder for ABI - would be replaced with actual contract ABI
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getIdeaDetails",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_ideaId", "type": "string"}],
    "name": "buyIdea",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Placeholder

class WalletService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  
  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async connectWallet(): Promise<WalletState> {
    if (!this.provider) {
      throw new Error('No Ethereum provider found. Please install MetaMask.');
    }
    
    try {
      const accounts = await this.provider.send('eth_requestAccounts', []);
      this.signer = this.provider.getSigner();
      
      const address = accounts[0];
      const chainId = (await this.provider.getNetwork()).chainId;
      const balance = ethers.utils.formatEther(await this.provider.getBalance(address));
      
      return {
        address,
        isConnected: true,
        chainId,
        balance
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.signer = null;
    // Note: There's no standard way to disconnect in ethers.js
    // This just clears the local state, the wallet remains connected
    return Promise.resolve();
  }

  async getWalletAddress(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  isWalletConnected(): boolean {
    return this.signer !== null;
  }

  // Placeholder for contract instance creation
  getContractInstance() {
    if (!this.signer) throw new Error('Wallet not connected');
    
    // This would create a contract instance for interacting with the smart contract
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      this.signer
    );
  }

  // Utility method for handling chain changes
  subscribeToChainChanges(callback: (chainId: number) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        callback(parseInt(chainId, 16));
      });
    }
  }

  // Utility method for handling account changes
  subscribeToAccountChanges(callback: (accounts: string[]) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }
}

// Export singleton instance
export const walletService = new WalletService();

// Create a method to get the contract for a specific idea
export const getIdeaContract = (ideaId: string) => {
  // This is a placeholder - in reality, you would create a contract instance
  // that's specific to the idea in question
  console.log(`Getting contract for idea ${ideaId}`);
  return walletService.getContractInstance();
};
