import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  assignTrabajador,
  clasificarServicios,
  createServicioFromSolicitud,
  getServicioBySolicitudId,
  listServicios,
  marcarServicioRealizado,
  type ServicioPanel,
} from "@/lib/panel-servicios";
import { useAuth } from "@/hooks/auth-context";
import { hasRole } from "@/lib/auth-demo";
import { nombresTrabajadoresParaAsignar } from "@/lib/panel-personal";
import { listSolicitudes } from "@/lib/solicitud-presupuesto";
import { cn } from "@/lib/utils";

type ServiciosTab = "sin-revisar" | "asignados" | "completados";

/** Títulos de campo en el modal (misma tipografía que eyebrow, color negro). */
const FIELD_TITLE =
  "text-[11px] font-bold uppercase tracking-[0.14em] text-foreground";

const TAB_META: { id: ServiciosTab; label: string; hintAdmin: string; hintStaff: string }[] = [
  {
    id: "sin-revisar",
    label: "Sin revisar",
    hintAdmin: "Pulsa una fila para ver el detalle y asignar técnico.",
    hintStaff: "Pulsa una fila para ver el detalle del servicio.",
  },
  {
    id: "asignados",
    label: "Asignados",
    hintAdmin: "Pulsa una fila para ver el detalle o marcar como completado.",
    hintStaff: "Pulsa una fila para ver el detalle o marcar como completado.",
  },
  {
    id: "completados",
    label: "Completados",
    hintAdmin: "Pulsa una fila para consultar el historial del trabajo.",
    hintStaff: "Pulsa una fila para consultar el historial del trabajo.",
  },
];

export function PanelServiciosSection() {
  const { user } = useAuth();
  const puedeAsignar = user ? hasRole(user, "administrador") : false;

  const [servicios, setServicios] = useState<ServicioPanel[]>([]);
  const [trabajadores, setTrabajadores] = useState<string[]>([]);
  const [tab, setTab] = useState<ServiciosTab>("sin-revisar");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = () => {
    for (const s of listSolicitudes()) {
      if (s.estado === "aceptado" && !getServicioBySolicitudId(s.id)) {
        createServicioFromSolicitud(s);
      }
    }
    setServicios(listServicios());
    if (puedeAsignar) setTrabajadores(nombresTrabajadoresParaAsignar());
  };

  useEffect(() => {
    refresh();
  }, [puedeAsignar]);

  const etapas = useMemo(() => clasificarServicios(servicios), [servicios]);

  const counts: Record<ServiciosTab, number> = {
    "sin-revisar": etapas.sinRevisar.length,
    asignados: etapas.asignados.length,
    completados: etapas.completados.length,
  };

  const itemsByTab: Record<ServiciosTab, ServicioPanel[]> = {
    "sin-revisar": etapas.sinRevisar,
    asignados: etapas.asignados,
    completados: etapas.completados,
  };

  const activeMeta = TAB_META.find((t) => t.id === tab)!;
  const items = itemsByTab[tab];
  const selected = selectedId ? (servicios.find((s) => s.id === selectedId) ?? null) : null;
  const vacio = servicios.length === 0;

  const openServicio = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const onAssign = (servicioId: string, trabajador: string) => {
    assignTrabajador(servicioId, trabajador || null);
    refresh();
    if (trabajador) setTab("asignados");
  };

  const onComplete = (servicioId: string) => {
    marcarServicioRealizado(servicioId, true);
    refresh();
    setTab("completados");
    setDialogOpen(false);
  };

  return (
    <>
      <section className="panel-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <p className="eyebrow">Operativa</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona los presupuestos aceptados por fase.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-4 sm:px-6">
          {TAB_META.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "panel-nav-link text-muted-foreground",
                tab === t.id && "panel-nav-link--active",
              )}
            >
              {t.label}
              <span className="ml-1.5 tabular-nums opacity-70">({counts[t.id]})</span>
            </button>
          ))}
        </div>

        {vacio ? (
          <div className="px-5 py-10 sm:px-6">
            <p className="text-sm text-muted-foreground">
              No hay servicios. Acepta una solicitud en{" "}
              <Link
                to="/panel"
                search={{ view: "presupuesto" }}
                className="font-semibold text-accent hover:underline"
              >
                Presupuesto
              </Link>{" "}
              para que aparezca en «Sin revisar».
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-6">
              <p className="text-sm text-muted-foreground">
                {puedeAsignar ? activeMeta.hintAdmin : activeMeta.hintStaff}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={refresh}>
                Actualizar
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="px-5 py-10 text-sm text-muted-foreground sm:px-6">
                Ninguno en «{activeMeta.label}».
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => openServicio(s.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-secondary/60 sm:px-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{s.cliente}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.servicio}</p>
                        <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
                          {s.mensaje}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{s.urgencia}</p>
                        {s.trabajador ? (
                          <p className="mt-1 text-accent">{s.trabajador}</p>
                        ) : (
                          <p className="mt-1">Sin asignar</p>
                        )}
                        <p className="mt-1">{new Date(s.createdAt).toLocaleDateString("es-ES")}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.cliente}</DialogTitle>
                <DialogDescription>{selected.servicio}</DialogDescription>
              </DialogHeader>

              <dl className="grid gap-4 text-sm">
                <div>
                  <dt className={FIELD_TITLE}>Urgencia</dt>
                  <dd className="mt-1.5 text-foreground">{selected.urgencia}</dd>
                </div>
                <div>
                  <dt className={FIELD_TITLE}>Teléfono</dt>
                  <dd className="mt-1.5 text-foreground">{selected.telefono}</dd>
                </div>
                <div>
                  <dt className={FIELD_TITLE}>Descripción</dt>
                  <dd className="mt-1.5 whitespace-pre-wrap text-foreground">{selected.mensaje}</dd>
                </div>
                <div>
                  <dt className={FIELD_TITLE}>Alta</dt>
                  <dd className="mt-1.5 text-foreground">
                    {new Date(selected.createdAt).toLocaleString("es-ES")}
                  </dd>
                </div>
                {selected.realizadoAt ? (
                  <div>
                    <dt className={FIELD_TITLE}>Completado</dt>
                    <dd className="mt-1.5 text-foreground">
                      {new Date(selected.realizadoAt).toLocaleString("es-ES")}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {tab !== "completados" && puedeAsignar ? (
                <div className="grid gap-2 border-t border-border pt-4">
                  <label className={`${FIELD_TITLE} block`} htmlFor="dlg-trab">
                    Asignar trabajador
                  </label>
                  <select
                    id="dlg-trab"
                    value={selected.trabajador ?? ""}
                    onChange={(e) => onAssign(selected.id, e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Sin asignar</option>
                    {trabajadores.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="border-t border-border pt-4">
                  <p className={FIELD_TITLE}>Técnico</p>
                  <p className="mt-1.5 text-sm font-medium text-foreground">
                    {selected.trabajador ?? "Sin asignar"}
                  </p>
                  {!puedeAsignar && !selected.trabajador ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      La asignación la realiza un administrador.
                    </p>
                  ) : null}
                </div>
              )}

              {tab === "asignados" && selected.trabajador ? (
                <Button
                  type="button"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => onComplete(selected.id)}
                >
                  Marcar completado
                </Button>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
