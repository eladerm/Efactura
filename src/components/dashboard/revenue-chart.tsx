'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'Ene', revenue: 4500 },
  { month: 'Feb', revenue: 5200 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Abr', revenue: 6100 },
  { month: 'May', revenue: 5900 },
  { month: 'Jun', revenue: 7200 },
];

const chartConfig = {
  revenue: {
    label: 'Ingresos',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="text-xl font-bold tracking-tight">Crecimiento de Ventas</CardTitle>
                <CardDescription>Resumen mensual de facturación autorizada.</CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-muted text-xs font-bold uppercase tracking-widest text-muted-foreground">USD</div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.05)', radius: 8 }}
                content={<ChartTooltipContent 
                    indicator="line"
                    formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
                />}
              />
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--accent))" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}