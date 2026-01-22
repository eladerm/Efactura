import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserNav } from '@/components/user-nav'
import { Logo } from './logo'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className='flex items-center gap-2'>
            <SidebarTrigger className="hidden max-lg:block" />
            <Link href="/dashboard" className="max-lg:hidden">
              <Logo />
            </Link>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
            <UserNav />
        </div>
    </header>
  )
}
