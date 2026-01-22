import { Feather } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold tracking-tighter", className)}>
      <div className="bg-primary-foreground text-primary p-2 rounded-lg">
        <Feather className="h-5 w-5" />
      </div>
      <span className="font-headline">Elapiel eFactura</span>
    </div>
  );
}
