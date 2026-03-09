import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <div className="flex items-center gap-4">
        <h1 className="text-5xl font-bold tracking-tight font-headline text-foreground leading-none">{title}</h1>
        <div className="h-2 w-16 bg-gradient-to-r from-accent to-accent/40 rounded-full"></div>
      </div>
      {children && <div className="flex items-center gap-3 mt-6">{children}</div>}
    </div>
  );
}