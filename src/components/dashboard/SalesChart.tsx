import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Area } from 'recharts';
import { BarChart3 } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', sales: 45000, expenses: 32000 },
  { month: 'Feb', sales: 52000, expenses: 35000 },
  { month: 'Mar', sales: 48000, expenses: 31000 },
  { month: 'Apr', sales: 61000, expenses: 40000 },
  { month: 'May', sales: 55000, expenses: 38000 },
  { month: 'Jun', sales: 67000, expenses: 42000 },
  { month: 'Jul', sales: 72000, expenses: 45000 },
  { month: 'Aug', sales: 69000, expenses: 43000 },
  { month: 'Sep', sales: 78000, expenses: 48000 },
  { month: 'Oct', sales: 85000, expenses: 52000 },
  { month: 'Nov', sales: 92000, expenses: 55000 },
  { month: 'Dec', sales: 98000, expenses: 58000 },
];

export function SalesChart() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Monthly Sales Overview</h3>
          <p className="text-sm text-muted-foreground">Revenue vs Expenses</p>
        </div>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)'
              }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
            />
            <Bar 
              dataKey="sales" 
              fill="hsl(var(--primary))" 
              radius={[6, 6, 0, 0]}
              name="Sales"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(var(--warning))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--warning))', strokeWidth: 0, r: 4 }}
              name="Expenses"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-primary" />
          <span className="text-sm text-muted-foreground">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-warning" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
      </div>
    </div>
  );
}
