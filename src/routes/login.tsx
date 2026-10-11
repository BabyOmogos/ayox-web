import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
  Wrench,
} from "lucide-react";

import heroAsset from "@/assets/reformas.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth-context";
import { DEMO_PROFILES, STAFF_ROLES } from "@/lib/auth-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Iniciar sesión | AYOX Servicios" }],
  }),
  component: LoginPage,
});

const TEL = "tel:+34666854310";
const EMAIL = "mailto:ayoxservicios@gmail.com";

const STATS = [
  { value: "24 h", label: "Urgencias atendidas" },
  { value: "4 fases", label: "Pipeline en Servicios" },
  { value: "Alicante", label: "Zona de actuación" },
] as const;

const PANEL_MODULES = [
  {
    icon: ClipboardList,
    title: "Presupuestos",
    text: "Revisa solicitudes de la web, acepta o rechaza y pasa el trabajo a operativa.",
  },
  {
    icon: Wrench,
    title: "Servicios",
    text: "Sin revisar, asignados y completados. El admin asigna técnico; el equipo cierra trabajos.",
  },
  {
    icon: LayoutDashboard,
    title: "Panel principal",
    text: "KPIs, gráficos de presupuestos y resumen del día al entrar.",
  },
  {
    icon: Users,
    title: "Personal",
    text: "Solo administrador: altas, especialidad, historial y acceso al panel.",
  },
] as const;

const WORKFLOW = [
  { step: "1", title: "Cliente solicita", detail: "Formulario en la web pública" },
  { step: "2", title: "Presupuesto", detail: "Equipo valida y responde" },
  { step: "3", title: "Servicio", detail: "Asignación y visita" },
  { step: "4", title: "Cierre", detail: "Trabajo marcado como completado" },
] as const;

const ROLE_ROWS = [
  { role: "Administrador", can: "Presupuestos, servicios, asignar técnicos, personal y panel completo." },
  { role: "Empleado", can: "Presupuestos, servicios y panel; no gestiona personal ni asignaciones." },
] as const;

function LoginPage() {
  const navigate = useNavigate();
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user && STAFF_ROLES.includes(user.role)) navigate({ to: "/panel" });
  }, [ready, user, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const ok = login(email, password);
    setSubmitting(false);
    if (!ok) {
      setError("Correo o contraseña incorrectos, o acceso revocado.");
      return;
    }
    navigate({ to: "/panel" });
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  if (!ready) {
    return (
      <div className="auth-page flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Cargando acceso…
      </div>
    );
  }

  return (
    <div className="auth-page min-h-screen pb-10">
      <header className="auth-topbar">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-2xl font-extrabold text-foreground">
            AYOX<span className="text-accent">.</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="auth-chip auth-chip--accent">Equipo interno</span>
            <span className="auth-chip hidden sm:inline-flex">Presupuesto cerrado</span>
            <span className="auth-chip hidden md:inline-flex">Datos en local (demo)</span>
            <Link
              to="/"
              className="auth-chip inline-flex items-center gap-1.5 text-foreground transition hover:border-accent"
            >
              <ArrowLeft className="size-3.5" aria-hidden /> Web pública
            </Link>
          </div>
        </div>
      </header>

      <div className="auth-layout-main mx-auto grid max-w-[1440px] gap-6 px-4 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start xl:gap-8">
        <div className="space-y-5">
          <section className="auth-hero">
            <img
              src={heroAsset.url}
              alt=""
              className="auth-hero-photo"
              fetchPriority="high"
            />
            <div className="auth-hero-shade" aria-hidden />
            <div className="auth-hero-inner">
              <p className="auth-kicker auth-kicker--on-dark">Gestión operativa</p>
              <h1 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.65rem]">
                Entra al panel donde se coordina el día a día de AYOX
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                Presupuestos desde la web, servicios en marcha y equipo alineado. Acceso solo para
                administradores y empleados autorizados.
              </p>
              <ul className="auth-stat-row mt-8">
                {STATS.map((s) => (
                  <li key={s.label} className="auth-stat-pill">
                    <span className="auth-stat-value">{s.value}</span>
                    <span className="auth-stat-label">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="auth-bento">
            {PANEL_MODULES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="auth-bento-card">
                <span className="auth-bento-icon">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="auth-bento-title">{title}</h2>
                <p className="auth-bento-text">{text}</p>
              </article>
            ))}
          </section>

          <section className="auth-panel-card">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="auth-kicker">Flujo de trabajo</p>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  De la solicitud al cierre
                </h2>
              </div>
              <p className="max-w-xs text-xs leading-5 text-muted-foreground">
                Misma lógica que verás dentro del panel; los datos de demo se guardan en tu
                navegador.
              </p>
            </div>
            <ol className="auth-workflow mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {WORKFLOW.map((w) => (
                <li key={w.step} className="auth-workflow-step">
                  <span className="auth-workflow-num">{w.step}</span>
                  <p className="font-semibold text-foreground">{w.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{w.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="auth-panel-card">
              <p className="auth-kicker">Roles en el panel</p>
              <ul className="mt-4 space-y-3">
                {ROLE_ROWS.map((r) => (
                  <li key={r.role} className="flex gap-3 rounded-xl bg-secondary/80 p-3">
                    <Shield className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.role}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{r.can}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="auth-panel-card">
              <p className="auth-kicker">Contacto directo</p>
              <div className="mt-4 space-y-4">
                <a href={TEL} className="auth-contact-line group">
                  <span className="auth-contact-icon">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-foreground">
                      Urgencias y presupuestos
                    </span>
                    <span className="mt-0.5 block text-lg font-bold text-foreground group-hover:text-accent">
                      666 854 310
                    </span>
                  </span>
                </a>
                <a href={EMAIL} className="auth-contact-line group">
                  <span className="auth-contact-icon">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-foreground">
                      Correo
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-foreground group-hover:text-accent">
                      ayoxservicios@gmail.com
                    </span>
                  </span>
                </a>
                <div className="auth-contact-line">
                  <span className="auth-contact-icon">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-foreground">
                      Zona
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      Alicante y alrededores · desplazamiento a domicilio y comunidades
                    </span>
                  </span>
                </div>
                <div className="auth-contact-line">
                  <span className="auth-contact-icon">
                    <CalendarClock className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-foreground">
                      Disponibilidad
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      Urgencias 24 h · resto de servicios con cita acordada
                    </span>
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <aside className="auth-aside xl:sticky xl:top-6">
          <div className="auth-form-card">
            <p className="auth-kicker">Acceso privado</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground">Iniciar sesión</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Credenciales de administrador o empleado. Tras entrar irás al panel principal.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  placeholder="nombre@empresa.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  placeholder="••••••••"
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-input accent-[var(--accent)]"
                />
                Recordarme en este dispositivo
              </label>

              <Button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-full bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {submitting ? "Entrando…" : "Entrar al panel"}
                  {!submitting ? <ArrowRight className="size-4" aria-hidden /> : null}
                </span>
              </Button>
            </form>
          </div>

          <div className="auth-demo-box auth-panel-card mt-4 p-5">
            <p className="auth-kicker">Accesos de demostración</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pulsa un perfil para rellenar. Contraseña:{" "}
              <strong className="text-foreground">contrasena</strong>
            </p>
            <ul className="mt-4 space-y-2">
              {DEMO_PROFILES.map((p) => (
                <li key={p.email}>
                  <button
                    type="button"
                    className={cn(
                      "auth-demo-profile w-full rounded-2xl border border-border bg-card px-4 py-3 text-left",
                      email === p.email && "border-accent ring-2 ring-accent/25",
                    )}
                    onClick={() => fillDemo(p.email, p.password)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{p.label}</p>
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                        Demo
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {p.email} · {p.password}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-tip-card mt-4 rounded-2xl border border-dashed border-border bg-secondary/50 p-4">
            <p className="text-sm font-semibold text-foreground">¿Eres cliente?</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              No necesitas cuenta aquí. Solicita presupuesto desde la web con el formulario público.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to="/">Ir a solicitar presupuesto</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
