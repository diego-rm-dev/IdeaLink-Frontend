import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { toast } from '@/hooks/use-toast';
import { walletService } from '@/services/walletService';
import { ExtendedIdea } from '../pages/IdeaDetailPage';

interface InvestmentModalProps {
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

const InvestmentModal: React.FC<InvestmentModalProps> = ({ idea, isOpen, onClose }) => {
  const [avaxAmount, setAvaxAmount] = useState('');
  const [vestingDuration, setVestingDuration] = useState('');
  const [message, setMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRoyaltyAgreement = !!idea.royalties;
  const isTokenized = !!idea.blockchain?.isTokenized;

  // Calcular monto esperado en AVAX
  const expectedAvaxAmount = idea.price ? (idea.price / AVAX_PRICE_USD).toFixed(4) : '0';

  const handleAvaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvaxAmount(e.target.value);
    setError(null);
  };

  const handleVestingDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVestingDuration(e.target.value);
    setError(null);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const validateForm = () => {
    if (!avaxAmount || isNaN(parseFloat(avaxAmount)) || parseFloat(avaxAmount) <= 0) {
      setError('Por favor ingresa un monto de AVAX válido y mayor que cero.');
      return false;
    }

    // Validar que avaxAmount coincida con el precio esperado
    if (parseFloat(avaxAmount).toFixed(4) !== expectedAvaxAmount) {
      setError(`El monto debe ser ${expectedAvaxAmount} AVAX para esta idea (precio: $${idea.price}).`);
      return false;
    }

    if (isTokenized && (!vestingDuration || isNaN(parseInt(vestingDuration)) || parseInt(vestingDuration) <= 0)) {
      setError('Por favor ingresa una duración de vesting válida (en segundos).');
      return false;
    }

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
      const duration = isTokenized ? parseInt(vestingDuration) : 2592000; // 30 días por defecto
      console.log('🔍 Propiedades de la idea:', { id: idea.id, price: idea.price, title: idea.title });
      console.log('🔍 Parámetros de inversión:', { 
        ideaId: ideaIdNum, 
        avaxAmount, 
        vestingDuration: duration, 
        isTokenized, 
        expectedAvaxAmount,
        priceUSD: idea.price
      });
      const result = await walletService.investInIdea(ideaIdNum, avaxAmount, duration);
      console.log('✅ Inversión confirmada:', result);

      toast({
        title: 'Inversión Exitosa',
        description: `Has invertido ${avaxAmount} AVAX y recibirás ${result.tokenAmount} IDEL.`,
      });

      if (message) {
        console.log('📝 Mensaje del inversor:', message);
      }

      onClose();
      setAvaxAmount('');
      setVestingDuration('');
      setMessage('');
      setAcceptTerms(false);
    } catch (err: any) {
      console.error('❌ Error al invertir en idea:', err);
      const errorMessage = err.message || 'No se pudo procesar la inversión. Verifica los parámetros o el estado del contrato.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invertir en {idea.title}</DialogTitle>
          <DialogDescription>
            Estás invirtiendo en "{idea.title}" de {idea.seller.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="avaxAmount">Monto de Inversión (AVAX)</Label>
            <Input
              id="avaxAmount"
              type="text"
              placeholder={expectedAvaxAmount}
              value={avaxAmount}
              onChange={handleAvaxAmountChange}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Ingresa {expectedAvaxAmount} AVAX (equivalente a ${idea.price} USD)
            </p>
          </div>

          {isTokenized && (
            <div className="space-y-2">
              <Label htmlFor="vestingDuration">Duración del Vesting (segundos)</Label>
              <Input
                id="vestingDuration"
                type="text"
                placeholder="2592000 (30 días)"
                value={vestingDuration}
                onChange={handleVestingDurationChange}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Ingresa la duración del vesting para los tokens
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (Opcional)</Label>
            <Textarea
              id="message"
              placeholder="Comparte por qué estás interesado en esta idea..."
              value={message}
              onChange={handleMessageChange}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {hasRoyaltyAgreement && (
            <div className="border rounded-md p-3 bg-amber-50">
              <h4 className="font-medium text-sm mb-2">Acuerdo de Regalías</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Esta idea incluye un acuerdo de regalías: {idea.royalties?.percentage} - {idea.royalties?.terms}
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
              Invertir Ahora
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
