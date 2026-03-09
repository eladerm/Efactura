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
  Search,
  Plus
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
      <div className="flex min-h-screen bg-[#FDFCFE] w-full">
        <Sidebar
          collapsible="icon"
          className="border-r border-sidebar-border bg-sidebar"
        >
          <SidebarHeader className="h-24 flex items-center justify-center border-b border-sidebar-border/30">
            <Logo className="text-white scale-90" />
          </SidebarHeader>
          <SidebarContent className="px-4 py-8">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href} className="mb-2">
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{ children: item.label }}
                      className="rounded-2xl h-12 transition-all duration-300 data-[active=true]:bg-accent data-[active=true]:shadow-lg data-[active=true]:shadow-accent/20"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border/30">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-3 rounded-2xl p-2.5 hover:bg-sidebar-accent/50 transition-all duration-300">
                  <Avatar className="h-10 w-10 border-2 border-accent/20 p-0.5">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
                      alt="Admin"
                      className="rounded-full"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="duration-200 group-data-[collapsible=icon]:hidden overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">
                      Administrador
                    </p>
                    <p className="text-[10px] text-white/40 truncate uppercase font-bold tracking-widest">
                      ELAPIEL S.A.
                    </p>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-white/40 duration-200 group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-4 glass-card rounded-2xl p-2" side="top" align="start">
                <DropdownMenuItem className="rounded-xl focus:bg-accent/10 focus:text-accent font-semibold p-2.5">
                  <LogOut className="mr-2 h-4 w-4" />
                  <Link href="/login">Cerrar Sesión</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-[#FDFCFE]">
          <header className="h-24 flex items-center justify-between px-10 border-b border-border/40 bg-white/70 backdrop-blur-2xl sticky top-0 z-20">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input 
                placeholder="Buscar facturas, clientes o productos..." 
                className="pl-12 h-12 bg-muted/30 border-none rounded-2xl focus-visible:ring-accent/10 transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="rounded-2xl relative hover:bg-muted/50 transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-3 right-3 h-2 w-2 bg-accent rounded-full border-2 border-white shadow-sm"></span>
                 </Button>
               </div>
               <div className="h-10 w-px bg-border/60 mx-1"></div>
               <Header />
            </div>
          </header>
          <main className="flex-1 p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto pb-20">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}