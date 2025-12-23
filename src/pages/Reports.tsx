import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  FileText,
  Download,
  Calendar
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Reports() {
  const { invoices, products } = useApp();

  // Calculate report data
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.grandTotal, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.grandTotal, 0);
  const lowStockProducts = products.filter(p => p.stockQty <= p.reorderLevel);
  const totalGST = invoices.filter(i => i.salesMode === 'GST').reduce((sum, i) => sum + i.totalTax, 0);

  const reports = [
    {
      title: 'Sales Report',
      description: 'Daily, weekly and monthly sales analysis',
      icon: TrendingUp,
      stats: `₹${totalRevenue.toLocaleString('en-IN')} total received`,
      variant: 'primary' as const,
    },
    {
      title: 'Outstanding Report',
      description: 'All pending payments and dues',
      icon: TrendingDown,
      stats: `₹${pendingRevenue.toLocaleString('en-IN')} pending`,
      variant: 'warning' as const,
    },
    {
      title: 'Stock Report',
      description: 'Inventory status and stock movement',
      icon: Package,
      stats: `${lowStockProducts.length} low stock items`,
      variant: 'destructive' as const,
    },
    {
      title: 'GST Report',
      description: 'GST summary for GSTR-1, GSTR-3B',
      icon: FileText,
      stats: `₹${totalGST.toLocaleString('en-IN')} total GST`,
      variant: 'success' as const,
    },
  ];

  const variantStyles = {
    primary: 'border-primary/20 bg-primary/5',
    warning: 'border-warning/20 bg-warning/5',
    destructive: 'border-destructive/20 bg-destructive/5',
    success: 'border-success/20 bg-success/5',
  };

  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    success: 'bg-success/10 text-success',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Reports</h1>
          <p className="mt-1 text-muted-foreground">Business analytics and GST reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report, index) => (
          <Card 
            key={report.title} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-card-hover animate-slide-up ${variantStyles[report.variant]}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconStyles[report.variant]}`}>
                <report.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-display text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-display text-lg font-semibold">{report.stats}</p>
              <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                View Details →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Quick Summary</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Invoices</p>
            <p className="mt-1 font-display text-2xl font-bold">{invoices.length}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="mt-1 font-display text-2xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Avg. Invoice</p>
            <p className="mt-1 font-display text-2xl font-bold">
              ₹{invoices.length > 0 ? Math.round(totalRevenue / invoices.filter(i => i.status === 'paid').length || 1).toLocaleString('en-IN') : 0}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">GST Rate</p>
            <p className="mt-1 font-display text-2xl font-bold">
              {invoices.filter(i => i.salesMode === 'GST').length}/{invoices.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
