import { LoginForm } from "@/components/login-form";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="login-mesh-bg relative flex min-h-svh flex-col lg:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
        <div className="relative z-10">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/25">
            <span className="font-heading text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white xl:text-5xl">
            Gestión inteligente
            <br />
            <span className="text-gradient">de facturas PDF</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-white/60">
            Procesa, filtra y exporta facturas de Cerámica Lima y Saint-Gobain
            en segundos. Diseñado para Distribuidora Surpass.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          {["Extracción automática", "Export Excel", "Multi-proveedor"].map(
            (feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                {feature}
              </span>
            ),
          )}
        </div>

        <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-10 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <LoginForm />
      </div>
    </div>
  );
}
