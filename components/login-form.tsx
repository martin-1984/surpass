"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  clearRememberedEmail,
  getRememberedEmail,
  saveRememberedEmail,
} from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = getRememberedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error al iniciar sesión");
      }

      if (rememberMe) {
        saveRememberedEmail(email.trim());
      } else {
        clearRememberedEmail();
      }

      toast.success("Bienvenido a Surpass");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="surface-card w-full max-w-md animate-scale-in shadow-lg">
      <CardHeader className="space-y-2 text-center lg:text-left">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#5B5AE8] shadow-md shadow-primary/20 lg:hidden">
          <span className="font-heading text-xl font-extrabold text-white">S</span>
        </div>
        <CardTitle className="font-heading text-2xl font-bold tracking-tight">Iniciar sesión</CardTitle>
        <CardDescription>Accede al panel de facturas de Distribuidora Surpass</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@surpass.local"
                className="h-11 rounded-xl border-border/80 bg-background pl-10"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="h-11 rounded-xl border-border/80 bg-background pl-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={rememberMe ? "current-password" : "password"}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember-me" className="cursor-pointer text-sm font-medium text-muted-foreground">
              Recordar sesión y guardar mi email
            </Label>
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-[#5B5AE8] font-semibold shadow-md shadow-primary/20 hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Entrar al panel"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
