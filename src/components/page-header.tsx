import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-12 animate-fade-in">
      <div className="flex items-center gap-6">
        <h1 className="text-6xl font-black tracking-tighter font-headline text-foreground leading-none drop-shadow-sm">
          {title}
        </h1>
        <div className="h-2 w-24 bg-gradient-to-r from-accent via-accent/60 to-transparent rounded-full mt-2"></div>
      </div>
      {children && <div className="flex items-center gap-4 mt-8">{children}</div>}
    </div>
  );
}