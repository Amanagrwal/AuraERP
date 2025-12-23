import { useState } from 'react';
import { Invoice, Client } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageCircle, Send, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { amountInWords } from '../Helper/AmountInWords';
import { getGrandTotal } from '../Helper/GrandTotal';
import { OrderStatus } from '../Helper/orderstatus';
import { calculateTax } from '../Helper/CalculateTax';
import { formatDate } from '../Helper/formatDate';
import { getVisibleTaxRows } from '../Helper/GetVisibleTaxRows';
import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  // client?: Client;
}

export function WhatsAppShareDialog({ open, onOpenChange, invoice }) {
  // const { currentFirm } = useApp();
  const [copied, setCopied] = useState(false);

  const taxText = getVisibleTaxRows(invoice)
  .map(
    (tax) =>
      `${tax.label}${tax.percent ? ` ${tax.percent}` : ""}: ₹${Number(
        tax.amount
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
  )
  .join("\n");

  if (!invoice) return null;

  const defaultMessage = `Dear ${invoice?.billing_name},

Greetings from ${invoice?.company?.company_name}!

Please find below your invoice details:

📄 Invoice No: ${invoice.invoice_no}
📅 Date: ${formatDate(invoice.date)}
💰 Amount: ${amountInWords(invoice?.net_amt)}

Items:
${invoice?.Invoice_details?.map((item, idx) => `${idx + 1}. ${item?.product?.product_name} x ${item.qty} = ${amountInWords(item.total_amt)}`).join('\n')}

---
Subtotal: ${amountInWords(invoice?.total_amt)}
${taxText}
Round Amount : ${invoice?.round_amt}
Grand Total: ${amountInWords(invoice.net_amt)}

Thank you for your business!

Best regards,
${invoice?.company?.company_name}
${invoice?.company?.gstin ? `GSTIN: ${invoice?.company?.gstin}` : ''}`;



  const [message, setMessage] = useState(defaultMessage);
  const [phoneNumber, setPhoneNumber] = useState(invoice?.customer?.phone || '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Message copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    const phone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    toast({ title: 'WhatsApp Opened', description: 'Continue sending in WhatsApp' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
               <FaWhatsapp className="h-5 w-5 text-white" />    
                       </div>
            Share on WhatsApp
          </DialogTitle>
          <DialogDescription>
            Send invoice details to {invoice.clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm">
                +91
              </span>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="rounded-l-none"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Message Preview</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            className="gap-2 bg-green-500 hover:bg-green-600"
            disabled={!phoneNumber || phoneNumber.length < 10}
          >
            <Send className="h-4 w-4" />
            Send via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
