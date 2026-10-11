export type UserRole = "administrador" | "empleado";

export const STAFF_ROLES: UserRole[] = ["administrador", "empleado"];

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
};

const STORAGE_KEY = "ayox-demo-session";
const BLOCKED_KEY = "ayox-panel-blocked-emails";

function readBlockedEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BLOCKED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function writeBlockedEmails(emails: string[]) {
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(emails));
}

export function isEmailBlocked(email: string): boolean {
  return readBlockedEmails().includes(email.trim().toLowerCase());
}

export function blockPanelEmail(email: string): void {
  const key = email.trim().toLowerCase();
  const set = new Set(readBlockedEmails());
  set.add(key);
  writeBlockedEmails([...set]);
}

export function unblockPanelEmail(email: string): void {
  const key = email.trim().toLowerCase();
  writeBlockedEmails(readBlockedEmails().filter((e) => e !== key));
}

const STAFF_ACCOUNTS_KEY = "ayox-staff-accounts-v1";

type AccountEntry = { password: string; user: SessionUser };

function readCustomStaffAccounts(): Record<string, AccountEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STAFF_ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, AccountEntry>;
  } catch {
    return {};
  }
}

function writeCustomStaffAccounts(map: Record<string, AccountEntry>) {
  localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(map));
}

/** Cuenta empleado creada desde Personal (contraseña demo: contrasena). */
export function registerStaffAccount(email: string, name: string, password = "contrasena") {
  const key = email.trim().toLowerCase();
  const map = readCustomStaffAccounts();
  map[key] = {
    password,
    user: {
      name,
      email: key,
      role: "empleado",
      roleLabel: "Empleado",
    },
  };
  writeCustomStaffAccounts(map);
}

export function unregisterStaffAccount(email: string) {
  const key = email.trim().toLowerCase();
  const map = readCustomStaffAccounts();
  delete map[key];
  writeCustomStaffAccounts(map);
}

const DEMO_ACCOUNTS: Record<string, AccountEntry> = {
  "admin@proyecto.test": {
    password: "contrasena",
    user: {
      name: "Administrador AYOX",
      email: "admin@proyecto.test",
      role: "administrador",
      roleLabel: "Administrador",
    },
  },
  "empleado@proyecto.test": {
    password: "contrasena",
    user: {
      name: "Técnico AYOX",
      email: "empleado@proyecto.test",
      role: "empleado",
      roleLabel: "Empleado",
    },
  },
};

export const DEMO_PROFILES = [
  { label: "Administrador", email: "admin@proyecto.test", password: "contrasena" },
  { label: "Empleado", email: "empleado@proyecto.test", password: "contrasena" },
] as const;

function lookupAccount(key: string): AccountEntry | undefined {
  return DEMO_ACCOUNTS[key] ?? readCustomStaffAccounts()[key];
}

export function loginDemo(email: string, password: string): SessionUser | null {
  const key = email.trim().toLowerCase();
  if (isEmailBlocked(key)) return null;
  const entry = lookupAccount(key);
  if (!entry || entry.password !== password) return null;
  return entry.user;
}

export function readStoredSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as SessionUser;
    if (!STAFF_ROLES.includes(user.role) || isEmailBlocked(user.email)) {
      clearSession();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function persistSession(user: SessionUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasRole(user: SessionUser, roles: UserRole | UserRole[]): boolean {
  const list = Array.isArray(roles) ? roles : [roles];
  return list.includes(user.role);
}
