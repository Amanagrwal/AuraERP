import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusStyles = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning border-warning/30',
  paid: 'bg-success/10 text-success border-success/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function RecentInvoices() {
  const { firmInvoices } = useApp();
  const recentInvoices = firmInvoices.slice(0, 5);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Recent Invoices</h3>
            <p className="text-sm text-muted-foreground">Last {recentInvoices.length} transactions</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">View All →</Button>
      </div>
      <div className="space-y-3">
        {recentInvoices.map((invoice, index) => (
          <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4 transition-all hover:bg-muted/50 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-mono text-sm font-semibold">{invoice.invoiceNo}</p>
                <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-display text-lg font-bold">₹{invoice.grandTotal.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground">{invoice.date}</p>
              </div>
              <Badge variant="outline" className={cn('rounded-lg', statusStyles[invoice.status])}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Eye className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
