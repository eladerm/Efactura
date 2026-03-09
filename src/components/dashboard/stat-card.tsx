import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  Icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
};

export function StatCard({ title, value, description, Icon, trend = 'neutral' }: StatCardProps) {
  return (
    <Card className="glass-card overflow-hidden group hover:border-accent/20 transition-all duration-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
            <Icon className="h-6 w-6" />
          </div>
          <div className={cn(
            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            trend === 'up' ? "bg-green-500/10 text-green-500" : 
            trend === 'down' ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : 'estable'}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          <p className="text-xs text-muted-foreground/80 font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}