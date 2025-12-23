import { StatCard } from '@/components/dashboard/StatCard';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useApp } from '@/context/AppContext';
import { IndianRupee, FileText, Clock, AlertTriangle, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchClint } from '@/components/Service/ClintAPI';

export default function Dashboard() {
  const { firmInvoices, firmProducts, firmClients, currentFirm , currentCompany } = useApp();

  const {
  data: clients = [],
  isLoading,
  isError,
} = useQuery({
  queryKey: ["clients", currentCompany?.id], 
  queryFn: () => fetchClint(currentCompany!.id),
  enabled: !!currentCompany?.id, 
});




  const totalSales = firmInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  
  const pendingAmount = firmInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.grandTotal, 0);
  const lowStockCount = firmProducts.filter(p => p.stockQty <= p.reorderLevel).length;
  const totalCustomers = clients?.length;

  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="mt-0.5 sm:mt-1 text-sm text-muted-foreground">Welcome back! Here's what's happening at {currentFirm?.name}</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Sales" 
          value={`₹${totalSales.toLocaleString('en-IN')}`} 
          subtitle="This month" 
          icon={<IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" />} 
          variant="primary" 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <StatCard 
          title="Outstanding" 
          value={`₹${pendingAmount.toLocaleString('en-IN')}`} 
          subtitle="Pending" 
          icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />} 
          variant="warning" 
        />
        <StatCard 
          title="Low Stock" 
          value={lowStockCount} 
          subtitle="Need restock" 
          icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />} 
          variant={lowStockCount > 0 ? 'destructive' : 'success'} 
        />
        <StatCard 
          title="Customers" 
          value={totalCustomers} 
          subtitle="Active" 
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />} 
          variant="info" 
        />
      </div>

      <QuickActions />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <SalesChart />
        <CashFlowChart />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><RecentInvoices /></div>
        <div><LowStockAlert /></div>
      </div>
    </div>
  );
}
