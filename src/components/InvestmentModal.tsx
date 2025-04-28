
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
import { Idea } from '@/data/mockData';

interface InvestmentModalProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ idea, isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRoyaltyAgreement = !!idea.royalties;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const validateForm = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid investment amount');
      return false;
    }

    if (parseFloat(amount) <= 0) {
      setError('Investment amount must be greater than zero');
      return false;
    }

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
      const response = await fetch('/api/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: idea.id,
          amount: parseFloat(amount),
          message,
          acceptedRoyaltyTerms: acceptTerms,
        }),
      });

      if (!response.ok) {
        throw new Error('Investment failed');
      }

      const data = await response.json();
      */

      // For now, just show a success message
      alert(`Investment of $${amount} submitted successfully!`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during investment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in This Idea</DialogTitle>
          <DialogDescription>
            You are investing in "{idea.title}" by {idea.seller.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (USD)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="1000"
              value={amount}
              onChange={handleAmountChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the amount you wish to invest
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Share why you're interested in this idea..."
              value={message}
              onChange={handleMessageChange}
              rows={3}
            />
          </div>

          {hasRoyaltyAgreement && (
            <div className="border rounded-md p-3 bg-amber-50">
              <h4 className="font-medium text-sm mb-2">Royalty Agreement</h4>
              <p className="text-sm text-muted-foreground mb-3">
                This idea includes a royalty deal: {idea.royalties?.percentage} - {idea.royalties?.terms}
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
              Invest Now
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
