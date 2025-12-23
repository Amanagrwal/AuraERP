import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const cashFlowData = [
  { day: '1', inflow: 12000, outflow: 8000 },
  { day: '5', inflow: 18000, outflow: 10000 },
  { day: '10', inflow: 22000, outflow: 15000 },
  { day: '15', inflow: 28000, outflow: 18000 },
  { day: '20', inflow: 35000, outflow: 22000 },
  { day: '25', inflow: 42000, outflow: 28000 },
  { day: '30', inflow: 48000, outflow: 32000 },
];

export function CashFlowChart() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Cash Flow Trend</h3>
          <p className="text-sm text-muted-foreground">This month's cash movement</p>
        </div>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData}>
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `Day ${value}`}
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
            <Area 
              type="monotone" 
              dataKey="inflow" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInflow)"
              name="Inflow"
            />
            <Area 
              type="monotone" 
              dataKey="outflow" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOutflow)"
              name="Outflow"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span className="text-sm text-muted-foreground">Cash Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span className="text-sm text-muted-foreground">Cash Outflow</span>
        </div>
      </div>
    </div>
  );
}
