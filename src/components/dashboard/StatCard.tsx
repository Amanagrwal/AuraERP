import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  trend?: { value: number; isPositive: boolean };
}

const variantStyles = {
  default: { card: 'bg-card border-border', icon: 'bg-muted text-foreground', value: 'text-foreground' },
  primary: { card: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20', icon: 'bg-primary text-primary-foreground shadow-primary', value: 'text-primary' },
  success: { card: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20', icon: 'bg-success text-success-foreground', value: 'text-success' },
  warning: { card: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20', icon: 'bg-warning text-warning-foreground', value: 'text-warning' },
  destructive: { card: 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20', icon: 'bg-destructive text-destructive-foreground', value: 'text-destructive' },
  info: { card: 'bg-gradient-to-br from-info/10 to-info/5 border-info/20', icon: 'bg-info text-info-foreground', value: 'text-info' },
};

export function StatCard({ title, value, subtitle, icon, variant = 'default', trend }: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-card-hover', styles.card)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn('mt-2 font-display text-3xl font-bold tracking-tight', styles.value)}>{value}</p>
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', trend.isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                  {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trend.value}%
                </span>
              )}
              {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', styles.icon)}>{icon}</div>
      </div>
    </div>
  );
}
