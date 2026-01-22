import Image from "next/image"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <LoginForm />
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://picsum.photos/seed/efactura/1200/1500"
          alt="Abstract purple background"
          data-ai-hint="abstract purple"
          fill
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      </div>
    </div>
  )
}
