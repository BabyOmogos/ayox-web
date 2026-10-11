export type PresupuestoEstado = "pendiente" | "aceptado" | "rechazado";

export type SolicitudPresupuesto = {
  id: string;
  nombre: string;
  telefono: string;
  servicio: string;
  urgencia: string;
  mensaje: string;
  estado: PresupuestoEstado;
  decidedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export const PRESUPUESTO_ESTADO_LABEL: Record<PresupuestoEstado, string> = {
  pendiente: "Pendiente",
  aceptado: "Aceptado",
  rechazado: "Rechazado",
};

export const URGENCIA_OPTIONS = [
  "Normal (2-3 días)",
  "Urgente (24h)",
  "Emergencia",
] as const;

export const WA_NUMBER = "34666854310";

import { createServicioFromSolicitud } from "@/lib/panel-servicios";

const LIST_KEY = "ayox-solicitudes-v1";
const ACTIVE_KEY = "ayox-solicitud-active-id";

function normalizeSolicitud(raw: Partial<SolicitudPresupuesto> & { id: string }): SolicitudPresupuesto {
  return {
    id: raw.id,
    nombre: raw.nombre ?? "",
    telefono: raw.telefono ?? "",
    servicio: raw.servicio ?? "",
    urgencia: raw.urgencia ?? "",
    mensaje: raw.mensaje ?? "",
    estado: raw.estado ?? "pendiente",
    decidedAt: raw.decidedAt,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}

function readList(): SolicitudPresupuesto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<SolicitudPresupuesto>[];
    return parsed.map((s) => normalizeSolicitud(s as Partial<SolicitudPresupuesto> & { id: string }));
  } catch {
    return [];
  }
}

function writeList(list: SolicitudPresupuesto[]) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function buildWhatsAppUrl(data: Pick<SolicitudPresupuesto, "nombre" | "telefono" | "servicio" | "urgencia" | "mensaje">) {
  const msg = `Hola, soy ${data.nombre}. Teléfono: ${data.telefono}. Servicio: ${data.servicio}. Urgencia: ${data.urgencia}. ${data.mensaje}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function openWhatsApp(data: Pick<SolicitudPresupuesto, "nombre" | "telefono" | "servicio" | "urgencia" | "mensaje">) {
  window.open(buildWhatsAppUrl(data), "_blank", "noopener,noreferrer");
}

export function createSolicitud(
  input: Omit<SolicitudPresupuesto, "id" | "createdAt" | "updatedAt">,
): SolicitudPresupuesto {
  const now = new Date().toISOString();
  const solicitud: SolicitudPresupuesto = {
    ...input,
    estado: input.estado ?? "pendiente",
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const list = readList();
  list.unshift(solicitud);
  writeList(list);
  localStorage.setItem(ACTIVE_KEY, solicitud.id);
  return solicitud;
}

export function updateSolicitud(id: string, patch: Partial<Omit<SolicitudPresupuesto, "id" | "createdAt">>) {
  const list = readList();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated: SolicitudPresupuesto = {
    ...list[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  writeList(list);
  return updated;
}

export function getActiveSolicitud(): SolicitudPresupuesto | null {
  const activeId = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_KEY) : null;
  const list = readList();
  if (activeId) {
    const found = list.find((s) => s.id === activeId);
    if (found) return found;
  }
  return list[0] ?? null;
}

export function setActiveSolicitudId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function listSolicitudes(): SolicitudPresupuesto[] {
  return readList();
}

export function acceptSolicitud(id: string): SolicitudPresupuesto | null {
  const updated = updateSolicitud(id, {
    estado: "aceptado",
    decidedAt: new Date().toISOString(),
  });
  if (updated) createServicioFromSolicitud(updated);
  return updated;
}

export function rejectSolicitud(id: string): SolicitudPresupuesto | null {
  return updateSolicitud(id, {
    estado: "rechazado",
    decidedAt: new Date().toISOString(),
  });
}

export function emptySolicitudFields(): Omit<
  SolicitudPresupuesto,
  "id" | "createdAt" | "updatedAt" | "decidedAt"
> {
  return {
    nombre: "",
    telefono: "",
    servicio: "",
    urgencia: "",
    mensaje: "",
    estado: "pendiente",
  };
}

type SolicitudInput = Omit<SolicitudPresupuesto, "id" | "createdAt" | "updatedAt" | "decidedAt">;

const EJEMPLOS_DEMO: SolicitudInput[] = [
  {
    nombre: "María Prueba",
    telefono: "600 000 000",
    servicio: "Fontanería",
    urgencia: "Urgente (24h)",
    mensaje:
      "Fuga en el fregadero del baño. Solicitud de prueba para ver la sección Presupuesto.",
    estado: "pendiente",
  },
  {
    nombre: "Pedro García",
    telefono: "611 222 333",
    servicio: "Cerrajería",
    urgencia: "Emergencia",
    mensaje:
      "No puedo abrir la puerta de casa. Segunda solicitud de prueba en el panel.",
    estado: "pendiente",
  },
  {
    nombre: "Elena Ruiz",
    telefono: "622 333 444",
    servicio: "Aire acondicionado",
    urgencia: "Normal (2-3 días)",
    mensaje:
      "El split del salón no enfría bien. Tercera solicitud de ejemplo para el panel.",
    estado: "pendiente",
  },
  {
    nombre: "Antonio López",
    telefono: "633 444 555",
    servicio: "Reformas y albañilería",
    urgencia: "Normal (2-3 días)",
    mensaje:
      "Quiero reformar el baño pequeño: plato de ducha y alicatado. Cuarta solicitud de ejemplo.",
    estado: "pendiente",
  },
  {
    nombre: "Comunidad Valdés 12",
    telefono: "644 555 666",
    servicio: "Mantenimiento de comunidades",
    urgencia: "Urgente (24h)",
    mensaje:
      "Filtración en el portal, escalera B. Quinta solicitud de ejemplo para presupuesto.",
    estado: "pendiente",
  },
];

function demoKey(fields: Pick<SolicitudPresupuesto, "nombre" | "telefono">) {
  return `${fields.nombre}|${fields.telefono}`;
}

/** Añade las solicitudes de demostración que falten (solo localStorage). */
export function createSolicitudesEjemplo(): number {
  const list = readList();
  const existing = new Set(list.map((s) => demoKey(s)));
  let added = 0;
  for (const fields of EJEMPLOS_DEMO) {
    if (existing.has(demoKey(fields))) continue;
    createSolicitud(fields);
    existing.add(demoKey(fields));
    added++;
  }
  return added;
}

/** @deprecated Usa createSolicitudesEjemplo */
export function createSolicitudEjemplo(): SolicitudPresupuesto {
  createSolicitudesEjemplo();
  return getActiveSolicitud()!;
}
