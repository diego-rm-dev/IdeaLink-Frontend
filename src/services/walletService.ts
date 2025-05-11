import { ethers } from 'ethers';
import { CONTRACT_ABI } from './abiCode';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
}

export const CONTRACT_ADDRESS = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'; // Actualiza con la nueva dirección

class WalletService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async connectWallet(): Promise<WalletState> {
    if (!this.provider) {
      console.error('❌ No Ethereum provider found');
      throw new Error('No Ethereum provider found. Please install MetaMask.');
    }

    try {
      console.log('🔗 Solicitando conexión a MetaMask...');
      const accounts = await this.provider.send('eth_requestAccounts', []);
      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      const address = accounts[0];
      const chainId = (await this.provider.getNetwork()).chainId;
      const balance = ethers.utils.formatEther(await this.provider.getBalance(address));

      console.log('✅ Wallet conectado:', { address, chainId, balance });

      return {
        address,
        isConnected: true,
        chainId,
        balance,
      };
    } catch (error) {
      console.error('❌ Error conectando wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    console.log('🔌 Desconectando wallet...');
    this.signer = null;
    this.contract = null;
    return Promise.resolve();
  }

  async getWalletAddress(): Promise<string | null> {
    if (!this.signer) {
      console.log('❌ No hay signer disponible');
      return null;
    }
    try {
      const address = await this.signer.getAddress();
      console.log('📍 Dirección del wallet:', address);
      return address;
    } catch (error) {
      console.error('❌ Error obteniendo dirección:', error);
      return null;
    }
  }

  isWalletConnected(): boolean {
    const isConnected = this.signer !== null;
    console.log('🔍 Estado de conexión del wallet:', isConnected);
    return isConnected;
  }

  getContractInstance(): ethers.Contract {
    if (!this.contract || !this.signer) {
      console.error('❌ Wallet no conectado o contrato no inicializado');
      throw new Error('Wallet not connected');
    }
    return this.contract;
  }

  async purchaseIdea(
    ideaId: number,
    avaxAmount: string
  ): Promise<{ transactionHash: string }> {
    const contract = this.getContractInstance();

    if (isNaN(ideaId) || ideaId <= 0) {
      throw new Error('Invalid ideaId: must be a positive number');
    }

    if (!avaxAmount || isNaN(parseFloat(avaxAmount)) || parseFloat(avaxAmount) <= 0) {
      throw new Error('Invalid AVAX amount: must be a positive number');
    }

    const weiAmount = ethers.utils.parseEther(avaxAmount);
    console.log('💸 Iniciando compra para idea:', {
      ideaId,
      avaxAmount,
      weiAmount: weiAmount.toString(),
      weiAmountHex: weiAmount.toHexString(),
    });

    try {
      // Intentar una llamada estática para depurar el revert
      try {
        console.log('🔍 Intentando llamada estática a purchaseIdea...');
        await contract.callStatic.purchaseIdea(ideaId, { value: weiAmount });
        console.log('✅ Llamada estática exitosa');
      } catch (staticError: any) {
        console.error('❌ Error en llamada estática:', staticError);
        if (staticError.reason) {
          throw new Error(`Llamada estática revertida: ${staticError.reason}`);
        } else if (staticError.data) {
          try {
            const decodedError = contract.interface.parseError(staticError.data);
            throw new Error(`Error del contrato (estático): ${decodedError.name} - ${decodedError.args.join(', ')}`);
          } catch (decodeError) {
            throw new Error(`Llamada estática revertida: error desconocido (data: ${staticError.data})`);
          }
        }
        throw new Error(`Llamada estática falló: ${staticError.message}`);
      }

      // Intentar estimar gas
      let gasLimit: ethers.BigNumber;
      try {
        gasLimit = await contract.estimateGas.purchaseIdea(ideaId, { value: weiAmount });
        gasLimit = gasLimit.mul(120).div(100); // Aumentar 20% para seguridad
        console.log('📏 Gas estimado:', gasLimit.toString());
      } catch (error) {
        console.warn('⚠️ No se pudo estimar gas, usando límite manual:', error);
        gasLimit = ethers.BigNumber.from('500000'); // Límite manual
      }

      // Confirmar parámetros antes de enviar
      console.log('🔍 Enviando transacción:', {
        ideaId,
        value: weiAmount.toString(),
        valueHex: weiAmount.toHexString(),
        gasLimit: gasLimit.toString(),
      });

      const tx = await contract.purchaseIdea(ideaId, {
        value: weiAmount,
        gasLimit,
      });

      console.log('⏳ Esperando confirmación de transacción:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transacción confirmada:', receipt.transactionHash);

      return {
        transactionHash: receipt.transactionHash,
      };
    } catch (error: any) {
      console.error('❌ Error al comprar idea:', error);
      if (error.reason) {
        throw new Error(`Transacción revertida: ${error.reason}`);
      } else if (error.data) {
        try {
          const decodedError = contract.interface.parseError(error.data);
          throw new Error(`Error del contrato: ${decodedError.name} - ${decodedError.args.join(', ')}`);
        } catch (decodeError) {
          console.warn('⚠️ No se pudo decodificar el error del contrato:', decodeError);
          if (error.data === '0x') {
            throw new Error('Transacción revertida: posible fallo en require sin mensaje');
          }
          throw new Error(`Transacción revertida: error desconocido (data: ${error.data})`);
        }
      }
      throw new Error(`Error: ${error.message}`);
    }
  }

  async investInIdea(
    ideaId: number,
    avaxAmount: string,
    vestingDuration: number
  ): Promise<{ transactionHash: string; tokenAmount: string }> {
    const contract = this.getContractInstance();

    if (isNaN(ideaId) || ideaId <= 0) {
      throw new Error('Invalid ideaId: must be a positive number');
    }

    if (!avaxAmount || isNaN(parseFloat(avaxAmount)) || parseFloat(avaxAmount) <= 0) {
      throw new Error('Invalid AVAX amount: must be a positive number');
    }

    const weiAmount = ethers.utils.parseEther(avaxAmount);
    console.log('💸 Iniciando inversión para idea:', {
      ideaId,
      avaxAmount,
      weiAmount: weiAmount.toString(),
      weiAmountHex: weiAmount.toHexString(),
    });

    try {
      // Intentar una llamada estática para depurar el revert
      try {
        console.log('🔍 Intentando llamada estática a deposit...');
        await contract.callStatic.deposit(ideaId, vestingDuration, { value: weiAmount });
        console.log('✅ Llamada estática exitosa');
      } catch (staticError: any) {
        console.error('❌ Error en llamada estática:', staticError);
        if (staticError.reason) {
          throw new Error(`Llamada estática revertida: ${staticError.reason}`);
        } else if (staticError.data) {
          try {
            const decodedError = contract.interface.parseError(staticError.data);
            throw new Error(`Error del contrato (estático): ${decodedError.name} - ${decodedError.args.join(', ')}`);
          } catch (decodeError) {
            throw new Error(`Llamada estática revertida: error desconocido (data: ${staticError.data})`);
          }
        }
        throw new Error(`Llamada estática falló: ${staticError.message}`);
      }

      // Intentar estimar gas
      let gasLimit: ethers.BigNumber;
      try {
        gasLimit = await contract.estimateGas.deposit(ideaId, vestingDuration, { value: weiAmount });
        gasLimit = gasLimit.mul(120).div(100); // Aumentar 20% para seguridad
        console.log('📏 Gas estimado:', gasLimit.toString());
      } catch (error) {
        console.warn('⚠️ No se pudo estimar gas, usando límite manual:', error);
        gasLimit = ethers.BigNumber.from('500000'); // Límite manual
      }

      // Confirmar parámetros antes de enviar
      console.log('🔍 Enviando transacción:', {
        ideaId,
        vestingDuration,
        value: weiAmount.toString(),
        valueHex: weiAmount.toHexString(),
        gasLimit: gasLimit.toString(),
      });

      const tx = await contract.deposit(ideaId, vestingDuration, {
        value: weiAmount,
        gasLimit,
      });

      console.log('⏳ Esperando confirmación de transacción:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transacción confirmada:', receipt.transactionHash);

      const tokenAmount = ethers.utils.formatUnits(weiAmount.mul(100), 18); // 1 AVAX = 100 IDEL
      return {
        transactionHash: receipt.transactionHash,
        tokenAmount,
      };
    } catch (error: any) {
      console.error('❌ Error al invertir en idea:', error);
      if (error.reason) {
        throw new Error(`Transacción revertida: ${error.reason}`);
      } else if (error.data) {
        try {
          const decodedError = contract.interface.parseError(error.data);
          throw new Error(`Error del contrato: ${decodedError.name} - ${decodedError.args.join(', ')}`);
        } catch (decodeError) {
          console.warn('⚠️ No se pudo decodificar el error del contrato:', decodeError);
          if (error.data === '0x') {
            throw new Error('Transacción revertida: posible fallo en require sin mensaje');
          }
          throw new Error(`Transacción revertida: error desconocido (data: ${error.data})`);
        }
      }
      throw new Error(`Error: ${error.message}`);
    }
  }

  async releaseTokens(ideaId: number): Promise<{ transactionHash: string; amount: string }> {
    const contract = this.getContractInstance();

    if (isNaN(ideaId) || ideaId <= 0) {
      throw new Error('Invalid ideaId: must be a positive number');
    }

    try {
      console.log('🔓 Iniciando liberación de tokens para idea:', ideaId);
      const tx = await contract.release(ideaId);

      console.log('⏳ Esperando confirmación de transacción:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transacción confirmada:', receipt.transactionHash);

      const event = receipt.events?.find((e: any) => e.event === 'Released');
      const amount = event ? ethers.utils.formatUnits(event.args.amount, 18) : '0';

      return {
        transactionHash: receipt.transactionHash,
        amount,
      };
    } catch (error) {
      console.error('❌ Error al liberar tokens:', error);
      throw error;
    }
  }

  async getVestedAmount(ideaId: number, investor: string): Promise<string> {
    const contract = this.getContractInstance();

    if (isNaN(ideaId) || ideaId <= 0) {
      throw new Error('Invalid ideaId: must be a positive number');
    }

    try {
      console.log('🔍 Consultando monto vested para:', { ideaId, investor });
      const amount = await contract.vestedAmount(ideaId, investor);
      const formattedAmount = ethers.utils.formatUnits(amount, 18);
      console.log('✅ Monto vested:', formattedAmount);
      return formattedAmount;
    } catch (error) {
      console.error('❌ Error consultando monto vested:', error);
      throw error;
    }
  }

  async getReleasableAmount(ideaId: number, investor: string): Promise<string> {
    const contract = this.getContractInstance();

    if (isNaN(ideaId) || ideaId <= 0) {
      throw new Error('Invalid ideaId: must be a positive number');
    }

    try {
      console.log('🔍 Consultando monto liberable para:', { ideaId, investor });
      const amount = await contract.releasableAmount(ideaId, investor);
      const formattedAmount = ethers.utils.formatUnits(amount, 18);
      console.log('✅ Monto liberable:', formattedAmount);
      return formattedAmount;
    } catch (error) {
      console.error('❌ Error consultando monto liberable:', error);
      throw error;
    }
  }

  async getInvestedAmount(ideaId: number, investor: string): Promise<string> {
    const contract = this.getContractInstance();

    if (isNaN(ideaId) || ideaId <= 0) {
      throw new Error('Invalid ideaId: must be a positive number');
    }

    try {
      console.log('🔍 Consultando monto invertido para:', { ideaId, investor });
      const amount = await contract.investedAmount(ideaId, investor);
      const formattedAmount = ethers.utils.formatEther(amount);
      console.log('✅ Monto invertido:', formattedAmount);
      return formattedAmount;
    } catch (error) {
      console.error('❌ Error consultando monto invertido:', error);
      throw error;
    }
  }

  subscribeToChainChanges(callback: (chainId: number) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        console.log('🔄 Cambio de red detectado:', chainId);
        callback(parseInt(chainId, 16));
      });
    }
  }

  subscribeToAccountChanges(callback: (accounts: string[]) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        console.log('🔄 Cambio de cuenta detectado:', accounts);
        callback(accounts);
      });
    }
  }

  unsubscribeFromChainChanges() {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners('chainChanged');
    }
  }

  unsubscribeFromAccountChanges() {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
    }
  }
}

export const walletService = new WalletService();

export const getIdeaContract = (ideaId: number) => {
  console.log(`📜 Obteniendo contrato para idea ${ideaId}`);
  return walletService.getContractInstance();
};
