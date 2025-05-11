import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { toast } from '@/hooks/use-toast';
import { walletService } from '@/services/walletService';
import { ExtendedIdea } from '../pages/IdeaDetailPage';
import { Diamond } from 'lucide-react';
import { ethers } from 'ethers';

interface PurchaseModalProps {
  idea: ExtendedIdea;
  isOpen: boolean;
  onClose: () => void;
}

const AVAX_PRICE_USD = 20; // Precio fijo de AVAX en USD (placeholder)

const parseIdeaId = (ideaId: string): number => {
  const match = ideaId.match(/idea(\d+)/);
  if (!match) {
    throw new Error(`Invalid ideaId format: ${ideaId}`);
  }
  return parseInt(match[1], 10);
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({ idea, isOpen, onClose }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRoyaltyAgreement = !!idea.royalties;
  
  // Calcular monto en AVAX
  const avaxAmount = useMemo(() => {
    if (!idea.price || isNaN(idea.price)) {
      console.warn('⚠️ idea.price inválido:', idea.price);
      setError('Precio de la idea inválido.');
      return '0';
    }
    const amount = idea.price / AVAX_PRICE_USD;
    console.log('🔍 Calculando avaxAmount:', { priceUSD: idea.price, avaxPriceUSD: AVAX_PRICE_USD, amount });
    return amount.toFixed(4); // 4 decimales
  }, [idea.price]);

  // Formatear precio en USD
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(idea.price || 0);

  const validateForm = () => {
    if (hasRoyaltyAgreement && !acceptTerms) {
      setError('Debes aceptar los términos del acuerdo de regalías.');
      return false;
    }

    try {
      const ideaIdNum = parseIdeaId(idea.id);
      if (isNaN(ideaIdNum) || ideaIdNum <= 0) {
        setError('ID de idea inválido: debe ser un número positivo.');
        return false;
      }
    } catch (err) {
      setError('Formato de ID de idea inválido.');
      return false;
    }

    if (!avaxAmount || isNaN(parseFloat(avaxAmount)) || parseFloat(avaxAmount) <= 0) {
      setError('Monto de AVAX inválido.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const ideaIdNum = parseIdeaId(idea.id);
      const weiAmount = ethers.utils.parseEther(avaxAmount);
      console.log('🔍 Propiedades de la idea:', { id: idea.id, price: idea.price, title: idea.title });
      console.log('🔍 Parámetros de compra:', { 
        ideaId: ideaIdNum, 
        avaxAmount, 
        weiAmount: weiAmount.toString(), 
        weiAmountHex: weiAmount.toHexString(),
        isTokenized: idea.blockchain?.isTokenized,
        priceUSD: idea.price
      });
      const result = await walletService.purchaseIdea(ideaIdNum, avaxAmount);
      console.log('✅ Compra confirmada:', result);

      toast({
        title: 'Compra Exitosa',
        description: `Has comprado la idea por ${avaxAmount} AVAX.`,
      });

      onClose();
      setAcceptTerms(false);
    } catch (err: any) {
      console.error('❌ Error al comprar idea:', err);
      const errorMessage = err.message || 'No se pudo procesar la compra. Verifica los parámetros o el estado del contrato.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comprar {idea.title}</DialogTitle>
          <DialogDescription>
            Estás a punto de comprar "{idea.title}" de {idea.seller.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <div className="border rounded-md p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Precio de Compra</span>
              <span className="text-xl font-bold text-idea-primary">{formattedPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monto en AVAX</span>
              <span className="text-lg font-semibold">{avaxAmount} AVAX</span>
            </div>
            {hasRoyaltyAgreement && (
              <div className="flex items-center gap-1 text-sm text-amber-600 mt-2">
                <Diamond size={14} />
                <span>Incluye acuerdo de regalías</span>
              </div>
            )}
          </div>

          {hasRoyaltyAgreement && (
            <div className="border rounded-md p-3 bg-amber-50">
              <h4 className="font-medium text-sm mb-2">Acuerdo de Regalías</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Al comprar esta idea, el creador original recibirá {idea.royalties?.percentage} ({idea.royalties?.terms}).
              </p>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-xs">
                  Acepto los términos del acuerdo de regalías
                </Label>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <SecondaryButton type="button" onClick={onClose} disabled={isLoading}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isLoading}>
              Comprar Ahora
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;