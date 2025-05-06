
import { useState, useEffect } from 'react';
import { walletService, WalletState } from '@/services/walletService';
import { toast } from '@/hooks/use-toast';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      try {
        if (walletService.isWalletConnected()) {
          const address = await walletService.getWalletAddress();
          if (address) {
            setWalletState(prev => ({
              ...prev,
              address,
              isConnected: true
            }));
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();

    // Set up listeners for account and chain changes
    walletService.subscribeToAccountChanges((accounts) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        setWalletState({
          address: null,
          isConnected: false,
          chainId: null,
          balance: null
        });
      } else {
        // Account changed
        setWalletState(prev => ({
          ...prev,
          address: accounts[0],
        }));
      }
    });

    walletService.subscribeToChainChanges((chainId) => {
      setWalletState(prev => ({
        ...prev,
        chainId
      }));
    });
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const newState = await walletService.connectWallet();
      setWalletState(newState);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${shortenAddress(newState.address)}`,
      });
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await walletService.disconnectWallet();
      setWalletState({
        address: null,
        isConnected: false,
        chainId: null,
        balance: null
      });
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
      return true;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      return false;
    }
  };

  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return {
    walletState,
    isConnecting,
    isConnected: walletState.isConnected,
    address: walletState.address,
    chainId: walletState.chainId,
    balance: walletState.balance,
    shortenedAddress: shortenAddress(walletState.address),
    connectWallet,
    disconnectWallet,
    getWalletAddress: walletService.getWalletAddress,
  };
}
