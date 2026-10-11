import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useAuth } from "@/hooks/auth-context";
import { hasRole, type UserRole } from "@/lib/auth-demo";
import { cn } from "@/lib/utils";

type PanelView = "home" | "presupuesto" | "servicios" | "personal";

type NavItem = { view: PanelView; label: string; roles?: UserRole[] };

const NAV: NavItem[] = [
  { view: "home", label: "Panel" },
  { view: "presupuesto", label: "Presupuesto" },
  { view: "servicios", label: "Servicios" },
  { view: "personal", label: "Personal", roles: ["administrador"] },
];

export function PanelShell({
  children,
  title,
  subtitle,
  activeView,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  activeView: PanelView;
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  if (!user) return null;

  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const visibleNav = NAV.filter(
    (item) => !item.roles || hasRole(user, item.roles),
  );

  return (
    <div className="panel-app min-h-screen">
      <nav className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/panel"
                search={{ view: "home" }}
                className="font-display text-xl font-bold text-foreground"
              >
                AYOX<span className="text-accent">.</span>
              </Link>
              <div className="hidden h-8 w-px bg-border lg:block" />
              <div className="flex flex-wrap gap-2">
                {visibleNav.map((item) => (
                  <Link
                    key={item.view}
                    to="/panel"
                    search={{ view: item.view }}
                    className={cn(
                      "panel-nav-link text-muted-foreground",
                      activeView === item.view && "panel-nav-link--active",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
                Rol: {user.roleLabel}
              </span>
              <Link
                to="/"
                className="panel-nav-link text-muted-foreground hover:text-foreground"
              >
                Web pública
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="panel-nav-link text-muted-foreground hover:text-foreground"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <p className="eyebrow">Gestión operativa</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
