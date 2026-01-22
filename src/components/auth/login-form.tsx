'use client'

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"

export function LoginForm() {
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login logic
        router.push('/dashboard')
    }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <Logo className="justify-center text-primary" />
        <h1 className="text-3xl font-bold font-headline mt-4">Bienvenido de Nuevo</h1>
        <p className="text-balance text-muted-foreground">
          Ingresa tu correo para iniciar sesión en tu cuenta
        </p>
      </div>
      <form className="grid gap-4" onSubmit={handleLogin}>
        <div className="grid gap-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            defaultValue="admin@elapiel.com"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="#"
              className="ml-auto inline-block text-sm underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" type="password" required defaultValue="password" />
        </div>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
          Iniciar Sesión
        </Button>
        <Button variant="outline" className="w-full">
          Iniciar Sesión con Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="#" className="underline">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
