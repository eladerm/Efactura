import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-2xl font-bold tracking-tight group", className)}>
      <div className="bg-gradient-to-br from-accent to-accent/60 text-white p-2.5 rounded-2xl shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform duration-500">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline text-foreground tracking-tighter text-xl">ELAPIEL</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-semibold opacity-90">Digital Invoicing</span>
      </div>
    </div>
  );
}