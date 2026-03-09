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
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar
          collapsible="icon"
          className="border-r border-sidebar-border bg-sidebar"
        >
          <SidebarHeader className="h-28 flex items-center justify-center border-b border-sidebar-border/50">
            <Logo className="scale-90" />
          </SidebarHeader>
          <SidebarContent className="px-4 py-8">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    className="rounded-xl h-12 transition-all duration-200 data-[active=true]:bg-accent data-[active=true]:text-white data-[active=true]:shadow-md"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-9 w-9 border-2 border-accent/20">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
                      alt="Admin"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="duration-200 group-data-[collapsible=icon]:hidden overflow-hidden">
                    <p className="text-sm font-bold truncate">
                      Administrador
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-wider">
                      ELAPIEL S.A.
                    </p>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-4 rounded-xl p-1" side="top" align="start">
                <DropdownMenuItem className="rounded-lg focus:bg-accent focus:text-white font-semibold p-2.5" asChild>
                  <Link href="/login" className="w-full flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-transparent">
          <header className="h-20 flex items-center justify-between px-8 border-b border-border/50 bg-white/60 backdrop-blur-md sticky top-0 z-20">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input 
                placeholder="Buscar facturas o clientes..." 
                className="pl-11 h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-accent/20 transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-accent/5">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-3 right-3 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
               </Button>
               <div className="h-8 w-px bg-border/50"></div>
               <Header />
            </div>
          </header>
          <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
