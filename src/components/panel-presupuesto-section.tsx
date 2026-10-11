import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

import {
  SolicitudPresupuestoForm,
  WhatsAppFromValuesButton,
  type SolicitudFormValues,
} from "@/components/solicitud-presupuesto-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  acceptSolicitud,
  createSolicitud,
  createSolicitudesEjemplo,
  emptySolicitudFields,
  listSolicitudes,
  openWhatsApp,
  PRESUPUESTO_ESTADO_LABEL,
  rejectSolicitud,
  setActiveSolicitudId,
  updateSolicitud,
  type PresupuestoEstado,
  type SolicitudPresupuesto,
} from "@/lib/solicitud-presupuesto";
import { cn } from "@/lib/utils";

function EstadoBadge({ estado }: { estado: PresupuestoEstado }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        estado === "pendiente" && "bg-amber-500/15 text-amber-800 dark:text-amber-200",
        estado === "aceptado" && "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
        estado === "rechazado" && "bg-muted text-muted-foreground line-through",
      )}
    >
      {PRESUPUESTO_ESTADO_LABEL[estado]}
    </span>
  );
}

export function PanelPresupuestoSection({ serviceOptions }: { serviceOptions: string[] }) {
  const [solicitudes, setSolicitudes] = useState<SolicitudPresupuesto[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null);
  const [liveValues, setLiveValues] = useState<SolicitudFormValues | null>(null);

  const refresh = () => {
    setSolicitudes(listSolicitudes());
  };

  useEffect(() => {
    createSolicitudesEjemplo();
    refresh();
  }, []);

  const editing = editingId ? (solicitudes.find((s) => s.id === editingId) ?? null) : null;

  useEffect(() => {
    setLiveValues(null);
  }, [editingId, dialogOpen]);

  const openSolicitud = (id: string) => {
    setEditingId(id);
    setActiveSolicitudId(id);
    setDialogOpen(true);
  };

  const openNueva = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const formValues: SolicitudFormValues = editing
    ? {
        nombre: editing.nombre,
        telefono: editing.telefono,
        servicio: editing.servicio,
        urgencia: editing.urgencia,
        mensaje: editing.mensaje,
      }
    : emptySolicitudFields();

  const currentValues = liveValues ?? formValues;

  const handleSave = (values: SolicitudFormValues) => {
    if (editing) {
      updateSolicitud(editing.id, values);
    } else {
      const created = createSolicitud(values);
      setEditingId(created.id);
      setActiveSolicitudId(created.id);
    }
    setSavedNotice(true);
    refresh();
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAccept = () => {
    if (!editing) return;
    acceptSolicitud(editing.id);
    setDecisionNotice("Presupuesto aceptado. Ya está en Servicios para asignar técnico.");
    refresh();
    window.setTimeout(() => setDecisionNotice(null), 4000);
  };

  const handleReject = () => {
    if (!editing) return;
    rejectSolicitud(editing.id);
    setDecisionNotice("Presupuesto rechazado.");
    refresh();
    window.setTimeout(() => setDecisionNotice(null), 3500);
  };

  const handleWhatsApp = (values: SolicitudFormValues) => {
    if (editing) updateSolicitud(editing.id, values);
    else {
      const created = createSolicitud(values);
      setEditingId(created.id);
    }
    openWhatsApp(values);
    refresh();
  };

  return (
    <>
      <section className="panel-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="eyebrow">Solicitudes guardadas</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">Listado de presupuestos</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Pulsa una fila para abrir el detalle en una ventana. Los datos se guardan en este
                navegador hasta conectar el backend.
              </p>
            </div>
            <Button
              type="button"
              className="bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
              onClick={openNueva}
            >
              Nueva solicitud
            </Button>
          </div>

          {solicitudes.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No hay solicitudes todavía. También pueden llegar desde la web pública.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-border">
              {solicitudes.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => openSolicitud(s.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-3 py-4 text-left transition hover:bg-secondary/60 sm:px-2"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{s.nombre}</p>
                        <EstadoBadge estado={s.estado} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.servicio || "Sin servicio"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{s.urgencia || "—"}</p>
                      <p className="mt-1">{new Date(s.updatedAt).toLocaleDateString("es-ES")}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? editing.nombre : "Nueva solicitud"}</DialogTitle>
            <DialogDescription>
              Mismos campos que en la web. Guarda cambios o envía por WhatsApp.
            </DialogDescription>
          </DialogHeader>

          {editing ? (
            <div className="flex flex-wrap items-center gap-2">
              <EstadoBadge estado={editing.estado} />
              {editing.estado === "aceptado" ? (
                <Link
                  to="/panel"
                  search={{ view: "servicios" }}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Ver en Servicios →
                </Link>
              ) : null}
            </div>
          ) : null}

          {savedNotice ? (
            <span className="inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              Cambios guardados
            </span>
          ) : null}

          {decisionNotice ? (
            <p className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              {decisionNotice}
            </p>
          ) : null}

          {editing && (editing.estado === "pendiente" || editing.estado === "rechazado") ? (
            <div className="flex flex-wrap gap-3 border-b border-border pb-4">
              <Button
                type="button"
                className="bg-emerald-600 text-white hover:bg-emerald-600/90"
                onClick={handleAccept}
              >
                <Check className="size-4" />
                Aceptar presupuesto
              </Button>
              {editing.estado === "pendiente" ? (
                <Button type="button" variant="outline" onClick={handleReject}>
                  <X className="size-4" />
                  Rechazar
                </Button>
              ) : (
                <p className="self-center text-sm text-muted-foreground">
                  Solicitud rechazada. Al aceptarla pasará a Servicios.
                </p>
              )}
            </div>
          ) : null}

          <SolicitudPresupuestoForm
            key={editingId ?? "new"}
            variant="light"
            serviceOptions={serviceOptions}
            initialValues={formValues}
            submitLabel="Guardar cambios"
            onSubmit={handleSave}
            onValuesChange={setLiveValues}
          />
          <div className="flex flex-wrap gap-3">
            <WhatsAppFromValuesButton values={currentValues} label="Enviar por WhatsApp con estos datos" />
            <Button type="button" variant="ghost" onClick={() => handleWhatsApp(currentValues)}>
              Guardar y abrir WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
