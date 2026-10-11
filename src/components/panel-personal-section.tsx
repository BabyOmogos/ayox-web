import { useEffect, useState } from "react";
import { UserPlus, UserX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AYOX_SERVICE_NAMES } from "@/lib/ayox-service-names";
import { marcarServicioRealizado } from "@/lib/panel-servicios";
import {
  createTrabajador,
  echarTrabajador,
  listTrabajadores,
  trabajosEnCurso,
  trabajosRealizados,
  updateTrabajadorEspecialidad,
  type TrabajadorPanel,
} from "@/lib/panel-personal";

const ESPECIALIDADES = ["Multi-gremio", ...AYOX_SERVICE_NAMES] as const;

export function PanelPersonalSection() {
  const [trabajadores, setTrabajadores] = useState<TrabajadorPanel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmEchar, setConfirmEchar] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, setRevision] = useState(0);

  const [newNombre, setNewNombre] = useState("");
  const [newEspecialidad, setNewEspecialidad] = useState<string>(ESPECIALIDADES[0]);
  const [newConPanel, setNewConPanel] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const refresh = () => {
    setTrabajadores(listTrabajadores());
    setRevision((n) => n + 1);
  };

  useEffect(() => {
    refresh();
  }, []);

  const selected = selectedId ? (trabajadores.find((t) => t.id === selectedId) ?? null) : null;

  const openTrabajador = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const onEchar = () => {
    if (!selected) return;
    echarTrabajador(selected.id);
    setConfirmEchar(false);
    setDialogOpen(false);
    setSelectedId(null);
    setNotice(`${selected.nombre} ya no puede acceder al panel.`);
    refresh();
    window.setTimeout(() => setNotice(null), 4000);
  };

  const onCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) return;
    const created = createTrabajador({
      nombre: newNombre,
      especialidad: newEspecialidad,
      conAccesoPanel: newConPanel,
      email: newConPanel ? newEmail : undefined,
    });
    setNewNombre("");
    setNewEmail("");
    setNewConPanel(false);
    setNotice(
      created.accesoPanel && created.email
        ? `Usuario creado. Acceso: ${created.email} / contrasena`
        : `Trabajador ${created.nombre} añadido al equipo.`,
    );
    refresh();
    window.setTimeout(() => setNotice(null), 6000);
  };

  const activos = trabajadores.filter((t) => t.activo);
  const inactivos = trabajadores.filter((t) => !t.activo);

  return (
    <>
      <div className="space-y-6">
        <section className="panel-card p-6 sm:p-8">
          <div className="border-b border-border pb-5">
            <p className="eyebrow">Alta de usuarios</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Generar usuario</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Crea un trabajador para asignarle servicios. Opcionalmente dale acceso al panel como
              empleado (contraseña demo: <strong>contrasena</strong>).
            </p>
          </div>

          <form onSubmit={onCreateUser} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="new-nombre">Nombre</Label>
              <Input
                id="new-nombre"
                required
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                placeholder="Nombre del trabajador"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-esp">Trabajo / especialidad</Label>
              <select
                id="new-esp"
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {ESPECIALIDADES.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 content-end">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={newConPanel}
                  onChange={(e) => setNewConPanel(e.target.checked)}
                  className="rounded border-input"
                />
                Acceso al panel (empleado)
              </label>
            </div>
            {newConPanel ? (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="new-email">Correo (opcional)</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Si lo dejas vacío se genera uno automático"
                />
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <UserPlus className="size-4" />
                Crear usuario
              </Button>
            </div>
          </form>
        </section>

        <section className="panel-card p-6 sm:p-8">
          <div className="border-b border-border pb-5">
            <p className="eyebrow">Equipo</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Todos tus trabajadores</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Pulsa un nombre para ver historial, cambiar su especialidad o echarlo del equipo.
            </p>
          </div>

          {notice ? (
            <p className="mt-4 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              {notice}
            </p>
          ) : null}

          <ul className="mt-6 divide-y divide-border">
            {activos.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => openTrabajador(t.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 py-4 text-left transition hover:bg-secondary/60 sm:px-2"
                >
                  <div>
                    <p className="font-medium text-foreground">{t.nombre}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.especialidad}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {t.accesoPanel ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                        Acceso al panel
                      </span>
                    ) : (
                      <span>Sin cuenta de panel</span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {inactivos.length > 0 ? (
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Dados de baja</p>
              <ul className="mt-3 space-y-2">
                {inactivos.map((t) => (
                  <li key={t.id} className="text-sm text-muted-foreground line-through">
                    {t.nombre}
                    {t.dismissedAt
                      ? ` · ${new Date(t.dismissedAt).toLocaleDateString("es-ES")}`
                      : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
          {selected ? (
            <PerfilTrabajador
              key={selected.id + selected.especialidad}
              trabajador={selected}
              onSaved={() => {
                refresh();
                setNotice("Especialidad actualizada.");
                window.setTimeout(() => setNotice(null), 2500);
              }}
              onRefresh={refresh}
              onRequestEchar={() => setConfirmEchar(true)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmEchar} onOpenChange={setConfirmEchar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Echar a {selected?.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción quita su permiso para entrar al panel
              {selected?.email ? ` (${selected.email})` : ""}. Los trabajos ya asignados se
              mantienen en el historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onEchar}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PerfilTrabajador({
  trabajador,
  onSaved,
  onRefresh,
  onRequestEchar,
}: {
  trabajador: TrabajadorPanel;
  onSaved: () => void;
  onRefresh: () => void;
  onRequestEchar: () => void;
}) {
  const [especialidad, setEspecialidad] = useState(trabajador.especialidad);

  const saveEspecialidad = () => {
    updateTrabajadorEspecialidad(trabajador.id, especialidad);
    onSaved();
    onRefresh();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{trabajador.nombre}</DialogTitle>
        <DialogDescription>
          {trabajador.email ? `${trabajador.email} · ` : null}
          {trabajador.accesoPanel ? "Empleado con panel" : "Sin acceso al panel"}
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border border-border bg-secondary/40 p-4">
        <Label htmlFor="perfil-esp">Trabajo que realiza</Label>
        <select
          id="perfil-esp"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {ESPECIALIDADES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <Button type="button" size="sm" className="mt-3" variant="secondary" onClick={saveEspecialidad}>
          Guardar especialidad
        </Button>
      </div>

      <TrabajosList
        titulo="Trabajos realizados"
        empty="Aún no tiene trabajos marcados como realizados."
        items={trabajosRealizados(trabajador.nombre)}
        onRefresh={onRefresh}
      />

      <TrabajosList
        titulo="En curso"
        empty="No tiene trabajos asignados en este momento."
        items={trabajosEnCurso(trabajador.nombre)}
        onRefresh={onRefresh}
        showMarcarRealizado
      />

      {trabajador.activo ? (
        <div className="border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={onRequestEchar}
          >
            <UserX className="size-4" />
            Echarlo
          </Button>
        </div>
      ) : null}
    </>
  );
}

function TrabajosList({
  titulo,
  empty,
  items,
  showMarcarRealizado,
  onRefresh,
}: {
  titulo: string;
  empty: string;
  items: ReturnType<typeof trabajosRealizados>;
  showMarcarRealizado?: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">{titulo}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((job) => (
            <li key={job.id} className="rounded-lg border border-border bg-secondary/40 p-3 text-sm">
              <p className="font-medium text-foreground">
                {job.servicio} — {job.cliente}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{job.mensaje}</p>
              {showMarcarRealizado && !job.realizadoAt ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    marcarServicioRealizado(job.id, true);
                    onRefresh();
                  }}
                >
                  Marcar como realizado
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
