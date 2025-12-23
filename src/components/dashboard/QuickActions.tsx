import { Button } from '@/components/ui/button';
import { FileText, Package, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { 
      label: 'Create Invoice', 
      icon: FileText, 
      onClick: () => navigate('/invoices/new'),
      variant: 'primary' as const,
      gradient: 'gradient-primary',
    },
    { 
      label: 'Add Product', 
      icon: Package, 
      onClick: () => navigate('/products'),
      variant: 'accent' as const,
      gradient: 'gradient-accent',
    },
    { 
      label: 'Add Client', 
      icon: Users, 
      onClick: () => navigate('/clients'),
      variant: 'success' as const,
      gradient: 'gradient-success',
    },
  ];

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <h3 className="mb-4 font-display text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${action.gradient} animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10 flex flex-col items-center text-center text-primary-foreground">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                <action.icon className="h-6 w-6" />
              </div>
              <span className="font-semibold">{action.label}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
