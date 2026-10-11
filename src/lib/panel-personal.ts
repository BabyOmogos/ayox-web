import {
  blockPanelEmail,
  registerStaffAccount,
  unregisterStaffAccount,
  unblockPanelEmail,
} from "@/lib/auth-demo";
import { listServicios, type ServicioPanel } from "@/lib/panel-servicios";

export type TrabajadorPanel = {
  id: string;
  nombre: string;
  especialidad: string;
  email: string | null;
  accesoPanel: boolean;
  activo: boolean;
  dismissedAt?: string;
  custom?: boolean;
};

const OVERRIDES_KEY = "ayox-trabajadores-v1";
const CUSTOM_KEY = "ayox-trabajadores-custom-v1";

const DEFAULT_TRABAJADORES: TrabajadorPanel[] = [
  {
    id: "tec-ayox",
    nombre: "Técnico AYOX",
    especialidad: "Multi-gremio",
    email: "empleado@proyecto.test",
    accesoPanel: true,
    activo: true,
  },
  {
    id: "carlos",
    nombre: "Carlos — Fontanería",
    especialidad: "Fontanería",
    email: null,
    accesoPanel: false,
    activo: true,
  },
  {
    id: "laura",
    nombre: "Laura — Reformas",
    especialidad: "Reformas y albañilería",
    email: null,
    accesoPanel: false,
    activo: true,
  },
  {
    id: "miguel",
    nombre: "Miguel — Cerrajería",
    especialidad: "Cerrajería",
    email: null,
    accesoPanel: false,
    activo: true,
  },
];

function readOverrides(): Record<string, Partial<TrabajadorPanel>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Partial<TrabajadorPanel>>;
  } catch {
    return {};
  }
}

function writeOverrides(map: Record<string, Partial<TrabajadorPanel>>) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
}

function readCustom(): TrabajadorPanel[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as TrabajadorPanel[]).map((t) => ({ ...t, custom: true }));
  } catch {
    return [];
  }
}

function writeCustom(list: TrabajadorPanel[]) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
}

function mergeDefault(base: TrabajadorPanel): TrabajadorPanel {
  const patch = readOverrides()[base.id];
  if (!patch) return { ...base };
  return {
    ...base,
    ...patch,
    id: base.id,
    custom: false,
  };
}

function findRaw(id: string): TrabajadorPanel | null {
  const custom = readCustom().find((t) => t.id === id);
  if (custom) return custom;
  const base = DEFAULT_TRABAJADORES.find((t) => t.id === id);
  if (base) return mergeDefault(base);
  return null;
}

export function listTrabajadores(): TrabajadorPanel[] {
  const defaults = DEFAULT_TRABAJADORES.map(mergeDefault);
  const custom = readCustom();
  return [...defaults, ...custom];
}

export function listTrabajadoresActivos(): TrabajadorPanel[] {
  return listTrabajadores().filter((t) => t.activo);
}

export function nombresTrabajadoresParaAsignar(): string[] {
  return listTrabajadoresActivos().map((t) => t.nombre);
}

export function getTrabajador(id: string): TrabajadorPanel | null {
  return listTrabajadores().find((t) => t.id === id) ?? null;
}

export function trabajosDeTrabajador(nombre: string): ServicioPanel[] {
  return listServicios().filter((s) => s.trabajador === nombre);
}

export function trabajosRealizados(nombre: string): ServicioPanel[] {
  return trabajosDeTrabajador(nombre).filter((s) => Boolean(s.realizadoAt));
}

export function trabajosEnCurso(nombre: string): ServicioPanel[] {
  return trabajosDeTrabajador(nombre).filter((s) => !s.realizadoAt);
}

export type CrearTrabajadorInput = {
  nombre: string;
  especialidad: string;
  conAccesoPanel: boolean;
  email?: string;
};

export function createTrabajador(input: CrearTrabajadorInput): TrabajadorPanel {
  const nombre = input.nombre.trim();
  const especialidad = input.especialidad.trim();
  let email: string | null = null;

  if (input.conAccesoPanel) {
    email = (input.email?.trim() || `empleado+${Date.now()}@ayox.local`).toLowerCase();
    registerStaffAccount(email, nombre);
  }

  const trabajador: TrabajadorPanel = {
    id: `custom-${crypto.randomUUID()}`,
    nombre,
    especialidad,
    email,
    accesoPanel: input.conAccesoPanel,
    activo: true,
    custom: true,
  };

  const list = readCustom();
  list.unshift(trabajador);
  writeCustom(list);
  return trabajador;
}

export function updateTrabajadorEspecialidad(id: string, especialidad: string): TrabajadorPanel | null {
  const value = especialidad.trim();
  if (!value) return null;

  const custom = readCustom();
  const cIdx = custom.findIndex((t) => t.id === id);
  if (cIdx !== -1) {
    custom[cIdx] = { ...custom[cIdx], especialidad: value };
    writeCustom(custom);
    return custom[cIdx];
  }

  const base = DEFAULT_TRABAJADORES.find((t) => t.id === id);
  if (!base) return null;

  const overrides = readOverrides();
  overrides[id] = { ...(overrides[id] ?? {}), especialidad: value };
  writeOverrides(overrides);
  return mergeDefault(base);
}

export function echarTrabajador(id: string): TrabajadorPanel | null {
  const raw = findRaw(id);
  if (!raw) return null;

  const dismissedAt = new Date().toISOString();

  if (raw.custom) {
    const list = readCustom();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      activo: false,
      accesoPanel: false,
      dismissedAt,
    };
    writeCustom(list);
    if (list[idx].email) {
      blockPanelEmail(list[idx].email!);
      unregisterStaffAccount(list[idx].email!);
    }
    return list[idx];
  }

  const overrides = readOverrides();
  overrides[id] = {
    ...(overrides[id] ?? {}),
    activo: false,
    accesoPanel: false,
    dismissedAt,
  };
  writeOverrides(overrides);

  const email = raw.email;
  if (email) blockPanelEmail(email);

  return mergeDefault(DEFAULT_TRABAJADORES.find((t) => t.id === id)!);
}
