
import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Loader2, Wallet, Check, ExternalLink, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WalletButton: React.FC = () => {
  const { 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    isConnecting, 
    shortenedAddress, 
    address,
    chainId
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const getNetworkName = (chainId: number | null) => {
    switch(chainId) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon';
      case 80001: return 'Mumbai Testnet';
      case 42161: return 'Arbitrum';
      default: return 'Unknown Network';
    }
  };

  return (
    <>
      {!isConnected ? (
        <Button
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1.5"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </>
          )}
        </Button>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{shortenedAddress}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">Connected Wallet</p>
              <p className="text-xs text-muted-foreground truncate">{address}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex cursor-pointer items-center" onClick={handleCopyAddress}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center" onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View on Explorer</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <Badge variant="outline" className="w-full justify-center">
                {chainId ? getNetworkName(chainId) : 'Unknown Network'}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex cursor-pointer items-center text-red-600 focus:text-red-600" onClick={() => {
              disconnectWallet();
              setIsOpen(false);
            }}>
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default WalletButton;
