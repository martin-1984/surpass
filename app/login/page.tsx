import { LoginForm } from "@/components/login-form";
import { FileSpreadsheet, ShieldCheck, Zap } from "lucide-react";

const features = [
  { icon: Zap, label: "Carga de PDF" },
  { icon: FileSpreadsheet, label: "Exportar Excel" },
  { icon: ShieldCheck, label: "Filtros y reportes" },
];

export default function LoginPage() {
  return (
    <div className="login-mesh-bg relative flex min-h-svh flex-col lg:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-[#4F4EC3] to-[#3B3A9C] p-10 text-primary-foreground lg:flex xl:p-14">
        <div className="relative z-10 animate-slide-up">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-xl backdrop-blur-md ring-1 ring-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/15">
            <span className="font-heading text-2xl font-extrabold tracking-wider text-white">S</span>
          </div>
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
            Gestión inteligente
            <br />
            <span className="text-white/80 font-normal">de facturas PDF</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-white/70 leading-relaxed">
            Procesa, filtra y exporta facturas en segundos. Diseñado exclusivamente para
            Distribuidora Surpass.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 animate-fade-in [animation-delay:200ms]">
          {features.map(({ icon: Icon, label }, index) => (
            <span
              key={label}
              style={{ animationDelay: `${index * 100 + 300}ms` }}
              className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20 cursor-default"
            >
              <Icon className="h-4 w-4 text-white/90" />
              {label}
            </span>
          ))}
        </div>

        {/* Orbs de fondo interactivos */}
        <div className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
        <div className="pointer-events-none absolute bottom-20 right-10 h-64 w-64 rounded-full bg-[#A95700]/20 blur-3xl animate-pulse-soft [animation-delay:1.5s]" />
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <LoginForm />
      </div>
    </div>
  );
}
