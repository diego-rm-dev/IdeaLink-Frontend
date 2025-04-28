
import React, { useState } from 'react';
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
import { Idea } from '@/data/mockData';
import { Diamond } from 'lucide-react';

interface PurchaseModalProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ idea, isOpen, onClose }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRoyaltyAgreement = !!idea.royalties;
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(idea.price);

  const validateForm = () => {
    if (hasRoyaltyAgreement && !acceptTerms) {
      setError('You must accept the royalty agreement terms');
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Placeholder for actual payment API integration
      // Would be connected to a payment gateway like MercadoPago
      /*
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: idea.id,
          acceptedRoyaltyTerms: acceptTerms,
        }),
      });

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      const data = await response.json();
      */

      // For now, just show a success message
      alert(`Idea purchased successfully for ${formattedPrice}!`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during purchase');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase This Idea</DialogTitle>
          <DialogDescription>
            You are about to purchase "{idea.title}" by {idea.seller.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <div className="border rounded-md p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Purchase Price</span>
              <span className="text-xl font-bold text-idea-primary">{formattedPrice}</span>
            </div>
            
            {hasRoyaltyAgreement && (
              <div className="flex items-center gap-1 text-sm text-amber-600">
                <Diamond size={14} />
                <span>Includes royalty agreement</span>
              </div>
            )}
          </div>

          {hasRoyaltyAgreement && (
            <div className="border rounded-md p-3 bg-amber-50">
              <h4 className="font-medium text-sm mb-2">Royalty Agreement</h4>
              <p className="text-sm text-muted-foreground mb-3">
                By purchasing this idea, the original creator will receive {idea.royalties?.percentage} ({idea.royalties?.terms}).
              </p>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-xs">
                  I accept the royalty terms of this agreement
                </Label>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <SecondaryButton type="button" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isLoading}>
              Buy Now
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
