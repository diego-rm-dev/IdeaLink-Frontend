
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "vestingDuration",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddr",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AVAXWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "avaxAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			}
		],
		"name": "release",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Released",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "to",
				"type": "address"
			}
		],
		"name": "withdrawAVAX",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "investor",
				"type": "address"
			}
		],
		"name": "investedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "RATE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "investor",
				"type": "address"
			}
		],
		"name": "releasableAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "investor",
				"type": "address"
			}
		],
		"name": "releasedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IdeaLinkToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalAVAXInvested",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ideaId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "investor",
				"type": "address"
			}
		],
		"name": "vestedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "vestings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "released",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const CONTRACT_ADDRESS = '0xD5c64211e39CB3b6D2474AF4FD963ad0fdd9F2cF'; 

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
