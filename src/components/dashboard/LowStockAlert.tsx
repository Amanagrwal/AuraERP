import { useApp } from '@/context/AppContext';
import { AlertTriangle, Package, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LowStockAlert() {
  const { firmProducts } = useApp();
  const lowStockProducts = firmProducts.filter(p => p.stockQty <= p.reorderLevel).slice(0, 5);

  return (
    <div className="rounded-2xl border border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent p-6 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Low Stock Alert</h3>
          <p className="text-sm text-muted-foreground">{lowStockProducts.length} items need restock</p>
        </div>
      </div>
      {lowStockProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">All products are in stock!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between rounded-xl bg-background/80 p-3 border border-border/50 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                  <Package className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-destructive">{product.stockQty} {product.unit}</p>
                  <p className="text-[10px] text-muted-foreground">Min: {product.reorderLevel}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Edit className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
