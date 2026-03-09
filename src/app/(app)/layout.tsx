'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Users,
  Package,
  FileText,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  FlaskConical,
  Bell,
  Search
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Resumen' },
  { href: '/invoices', icon: FileText, label: 'Facturas' },
  { href: '/customers', icon: Users, label: 'Clientes' },
  { href: '/products', icon: Package, label: 'Catálogo' },
  { href: '/dashboard/pruebas', icon: FlaskConical, label: 'Laboratorio SRI' },
  { href: '/settings', icon: Settings, label: 'Configuración' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full bg-mesh">
        <Sidebar
          collapsible="icon"
          className="border-r border-sidebar-border bg-sidebar"
        >
          <SidebarHeader className="h-28 flex items-center justify-center border-b border-sidebar-border/20">
            <Logo className="text-white scale-90" />
          </SidebarHeader>
          <SidebarContent className="px-6 py-10">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href} className="mb-3">
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{ children: item.label }}
                      className="rounded-2xl h-14 transition-all duration-500 data-[active=true]:bg-accent data-[active=true]:shadow-[0_10px_20px_-5px_rgba(224,17,95,0.4)] data-[active=true]:scale-105"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-6 border-t border-sidebar-border/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-4 rounded-2xl p-3 hover:bg-sidebar-accent/50 transition-all duration-500">
                  <Avatar className="h-11 w-11 border-2 border-accent/30 p-0.5">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
                      alt="Admin"
                      className="rounded-full"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="duration-200 group-data-[collapsible=icon]:hidden overflow-hidden">
                    <p className="text-sm font-black text-white truncate">
                      Administrador
                    </p>
                    <p className="text-[10px] text-accent/80 truncate uppercase font-bold tracking-[0.2em]">
                      ELAPIEL S.A.
                    </p>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-white/30 duration-200 group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 mb-6 glass-card rounded-2xl p-2" side="top" align="start">
                <DropdownMenuItem className="rounded-xl focus:bg-accent/10 focus:text-accent font-bold p-3">
                  <LogOut className="mr-3 h-4 w-4" />
                  <Link href="/login">Cerrar Sesión</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-transparent">
          <header className="h-28 flex items-center justify-between px-12 border-b border-border/10 bg-white/40 dark:bg-black/20 backdrop-blur-3xl sticky top-0 z-20">
            <div className="relative w-full max-w-lg hidden md:block">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input 
                placeholder="Explorar facturas, clientes o servicios..." 
                className="pl-14 h-14 bg-muted/40 border-none rounded-2xl focus-visible:ring-accent/20 transition-all text-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" className="rounded-2xl relative hover:bg-muted/50 transition-all hover:scale-110">
                    <Bell className="h-6 w-6 text-muted-foreground/80" />
                    <span className="absolute top-4 right-4 h-2.5 w-2.5 bg-accent rounded-full border-2 border-white dark:border-black shadow-lg"></span>
                 </Button>
               </div>
               <div className="h-10 w-px bg-border/20 mx-2"></div>
               <Header />
            </div>
          </header>
          <main className="flex-1 p-12 overflow-y-auto">
            <div className="max-w-7xl mx-auto pb-24">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}