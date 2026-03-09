import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-2xl font-bold tracking-tight group", className)}>
      <div className="bg-gradient-to-br from-accent via-accent/90 to-accent/70 text-white p-2.5 rounded-2xl shadow-xl shadow-accent/30 group-hover:rotate-6 transition-all duration-500 group-hover:scale-110">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline text-foreground tracking-tighter text-2xl">ELAPIEL</span>
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold opacity-100 mt-0.5">ESTÉTICA DIGITAL</span>
      </div>
    </div>
  );
}