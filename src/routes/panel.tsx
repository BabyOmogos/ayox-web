import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Phone, Wrench } from "lucide-react";

import { PanelDashboardSection } from "@/components/panel-dashboard-section";
import { PanelPresupuestoSection } from "@/components/panel-presupuesto-section";
import { PanelPersonalSection } from "@/components/panel-personal-section";
import { PanelServiciosSection } from "@/components/panel-servicios-section";
import { PanelShell } from "@/components/panel-shell";
import { useAuth } from "@/hooks/auth-context";
import { AYOX_SERVICE_NAMES } from "@/lib/ayox-service-names";
import { hasRole, STAFF_ROLES } from "@/lib/auth-demo";

const PANEL_VIEWS = ["home", "presupuesto", "servicios", "personal"] as const;
type PanelSearch = { view?: (typeof PANEL_VIEWS)[number] };

export const Route = createFileRoute("/panel")({
  validateSearch: (search: Record<string, unknown>): PanelSearch => {
    const raw = search.view as string | undefined;
    const view = PANEL_VIEWS.includes(raw as (typeof PANEL_VIEWS)[number])
      ? (raw as PanelSearch["view"])
      : "home";
    return { view: view || "home" };
  },
  head: () => ({
    meta: [{ title: "Panel | AYOX Servicios" }],
  }),
  component: PanelPage,
});

function PanelPage() {
  const navigate = useNavigate();
  const { user, ready, logout } = useAuth();
  const { view = "home" } = Route.useSearch();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!STAFF_ROLES.includes(user.role)) {
      logout();
      navigate({ to: "/login" });
    }
  }, [ready, user, navigate, logout]);

  if (!ready || !user) {
    return (
      <div className="panel-app flex min-h-screen items-center justify-center text-muted-foreground">
        Cargando panel…
      </div>
    );
  }

  const titles: Record<NonNullable<PanelSearch["view"]>, { title: string; subtitle: string }> = {
    home: {
      title: "Panel principal",
      subtitle: "Resumen de presupuestos, servicios y equipo en tiempo real (datos locales).",
    },
    presupuesto: {
      title: "Solicitud de presupuesto",
      subtitle:
        "Mismo formulario que en la web: consulta y edita los datos antes de enviarlos por WhatsApp.",
    },
    servicios: {
      title: "Servicios",
      subtitle: "Sin revisar, asignados y completados: sigue cada trabajo hasta cerrarlo.",
    },
    personal: {
      title: "Personal y accesos",
      subtitle: "Consulta el historial de cada trabajador y gestiona su acceso al panel.",
    },
  };

  const meta = titles[view];

  return (
    <PanelShell title={meta.title} subtitle={meta.subtitle} activeView={view}>
      {view === "presupuesto" && (
        <PanelPresupuestoSection serviceOptions={[...AYOX_SERVICE_NAMES]} />
      )}

      {view === "home" && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <PanelDashboardSection />
          <aside className="panel-card h-fit p-5">
            <p className="eyebrow">Accesos rápidos</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hola, {user.name} ({user.roleLabel})
            </p>
            <div className="mt-4 space-y-2">
              <QuickLink to="/panel" search={{ view: "presupuesto" }} label="Presupuestos" />
              <QuickLink to="/panel" search={{ view: "servicios" }} label="Servicios" />
              {hasRole(user, "administrador") && (
                <QuickLink to="/panel" search={{ view: "personal" }} label="Personal" />
              )}
              <a
                href="tel:+34666854310"
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-foreground transition hover:bg-secondary"
              >
                <Phone className="size-4 text-accent" /> Urgencias 666 854 310
              </a>
            </div>
          </aside>
        </div>
      )}

      {view === "servicios" && <PanelServiciosSection />}

      {view === "personal" && hasRole(user, "administrador") && <PanelPersonalSection />}
    </PanelShell>
  );
}

function QuickLink({
  to,
  search,
  label,
}: {
  to: string;
  search: PanelSearch;
  label: string;
}) {
  return (
    <Link
      to={to}
      search={search}
      className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-foreground transition hover:bg-secondary"
    >
      <Wrench className="size-4 text-accent" /> {label}
    </Link>
  );
}

