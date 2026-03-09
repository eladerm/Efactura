import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-2xl font-bold tracking-tight group", className)}>
      <div className="bg-accent text-white p-2 rounded-xl shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform duration-300">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline text-foreground tracking-tighter text-xl">ELAPIEL</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold mt-0.5">ESTÉTICA DIGITAL</span>
      </div>
    </div>
  );
}