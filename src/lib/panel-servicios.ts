import type { SolicitudPresupuesto } from "@/lib/solicitud-presupuesto";

export type ServicioPanel = {
  id: string;
  solicitudId: string;
  cliente: string;
  telefono: string;
  servicio: string;
  urgencia: string;
  mensaje: string;
  trabajador: string | null;
  realizadoAt?: string;
  createdAt: string;
  updatedAt: string;
};

const LIST_KEY = "ayox-servicios-v1";

function readList(): ServicioPanel[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ServicioPanel[];
  } catch {
    return [];
  }
}

function writeList(list: ServicioPanel[]) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function listServicios(): ServicioPanel[] {
  return readList();
}

export function getServicioBySolicitudId(solicitudId: string): ServicioPanel | null {
  return readList().find((s) => s.solicitudId === solicitudId) ?? null;
}

export function createServicioFromSolicitud(solicitud: SolicitudPresupuesto): ServicioPanel {
  const existing = getServicioBySolicitudId(solicitud.id);
  if (existing) return existing;

  const now = new Date().toISOString();
  const servicio: ServicioPanel = {
    id: crypto.randomUUID(),
    solicitudId: solicitud.id,
    cliente: solicitud.nombre,
    telefono: solicitud.telefono,
    servicio: solicitud.servicio,
    urgencia: solicitud.urgencia,
    mensaje: solicitud.mensaje,
    trabajador: null,
    createdAt: now,
    updatedAt: now,
  };
  const list = readList();
  list.unshift(servicio);
  writeList(list);
  return servicio;
}

export function marcarServicioRealizado(servicioId: string, realizado = true): ServicioPanel | null {
  const list = readList();
  const idx = list.findIndex((s) => s.id === servicioId);
  if (idx === -1) return null;
  const updated: ServicioPanel = {
    ...list[idx],
    realizadoAt: realizado ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  writeList(list);
  return updated;
}

export type ServiciosPorEtapa = {
  sinRevisar: ServicioPanel[];
  asignados: ServicioPanel[];
  completados: ServicioPanel[];
};

export function clasificarServicios(servicios: ServicioPanel[]): ServiciosPorEtapa {
  const completados = servicios.filter((s) => Boolean(s.realizadoAt));
  const asignados = servicios.filter((s) => !s.realizadoAt && Boolean(s.trabajador));
  const sinRevisar = servicios.filter((s) => !s.realizadoAt && !s.trabajador);
  return { sinRevisar, asignados, completados };
}

export function assignTrabajador(servicioId: string, trabajador: string | null): ServicioPanel | null {
  const list = readList();
  const idx = list.findIndex((s) => s.id === servicioId);
  if (idx === -1) return null;
  const updated: ServicioPanel = {
    ...list[idx],
    trabajador: trabajador || null,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  writeList(list);
  return updated;
}
