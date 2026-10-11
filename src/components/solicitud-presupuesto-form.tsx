import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  openWhatsApp,
  URGENCIA_OPTIONS,
  type SolicitudPresupuesto,
} from "@/lib/solicitud-presupuesto";

export type SolicitudFormValues = Pick<
  SolicitudPresupuesto,
  "nombre" | "telefono" | "servicio" | "urgencia" | "mensaje"
>;

type SolicitudPresupuestoFormProps = {
  serviceOptions: string[];
  initialValues: SolicitudFormValues;
  variant?: "light" | "dark";
  submitLabel?: string;
  showSaveHint?: boolean;
  onSubmit: (values: SolicitudFormValues) => void;
  onValuesChange?: (values: SolicitudFormValues) => void;
};

const fieldClass = (variant: "light" | "dark") =>
  variant === "dark"
    ? "w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
    : "w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-ring";

export function SolicitudPresupuestoForm({
  serviceOptions,
  initialValues,
  variant = "light",
  submitLabel = "Enviar solicitud por WhatsApp",
  showSaveHint = true,
  onSubmit,
  onValuesChange,
}: SolicitudPresupuestoFormProps) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const set = (key: keyof SolicitudFormValues, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      onValuesChange?.(next);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="sol-nombre" className={variant === "dark" ? "text-zinc-300" : undefined}>
            Nombre completo
          </Label>
          <input
            id="sol-nombre"
            name="nombre"
            required
            value={values.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            className={fieldClass(variant)}
            placeholder="Nombre completo"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sol-telefono" className={variant === "dark" ? "text-zinc-300" : undefined}>
            Teléfono
          </Label>
          <input
            id="sol-telefono"
            name="telefono"
            required
            value={values.telefono}
            onChange={(e) => set("telefono", e.target.value)}
            className={fieldClass(variant)}
            placeholder="Teléfono"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sol-servicio" className={variant === "dark" ? "text-zinc-300" : undefined}>
          Tipo de servicio
        </Label>
        <select
          id="sol-servicio"
          name="servicio"
          required
          value={values.servicio}
          onChange={(e) => set("servicio", e.target.value)}
          className={fieldClass(variant)}
        >
          <option value="" disabled>
            Tipo de servicio
          </option>
          {serviceOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sol-urgencia" className={variant === "dark" ? "text-zinc-300" : undefined}>
          Nivel de urgencia
        </Label>
        <select
          id="sol-urgencia"
          name="urgencia"
          required
          value={values.urgencia}
          onChange={(e) => set("urgencia", e.target.value)}
          className={fieldClass(variant)}
        >
          <option value="" disabled>
            Nivel de urgencia
          </option>
          {URGENCIA_OPTIONS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sol-mensaje" className={variant === "dark" ? "text-zinc-300" : undefined}>
          Describe el problema
        </Label>
        <textarea
          id="sol-mensaje"
          name="mensaje"
          required
          minLength={20}
          rows={4}
          value={values.mensaje}
          onChange={(e) => set("mensaje", e.target.value)}
          className={fieldClass(variant)}
          placeholder="Describe el problema (mínimo 20 caracteres)"
        />
      </div>

      {showSaveHint ? (
        <p className={`text-xs ${variant === "dark" ? "text-zinc-500" : "text-muted-foreground"}`}>
          Solo usamos tus datos para gestionar tu visita.
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
      >
        <MessageCircle className="size-4" />
        {submitLabel}
      </Button>
    </form>
  );
}

export function SolicitudResumen({
  data,
  variant = "light",
}: {
  data: SolicitudPresupuesto;
  variant?: "light" | "dark";
}) {
  const label = variant === "dark" ? "text-zinc-500" : "text-muted-foreground";
  const value = variant === "dark" ? "text-zinc-200" : "text-foreground";
  const rows: [string, string][] = [
    ["Nombre", data.nombre],
    ["Teléfono", data.telefono],
    ["Servicio", data.servicio],
    ["Urgencia", data.urgencia],
    ["Mensaje", data.mensaje],
  ];
  return (
    <dl className={`grid gap-3 text-sm ${variant === "dark" ? "text-zinc-300" : ""}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 sm:grid-cols-[140px_1fr]">
          <dt className={label}>{k}</dt>
          <dd className={`${value} whitespace-pre-wrap`}>{v}</dd>
        </div>
      ))}
      <div className={`text-xs ${label}`}>
        Actualizado: {new Date(data.updatedAt).toLocaleString("es-ES")}
      </div>
    </dl>
  );
}

export function WhatsAppFromValuesButton({
  values,
  label = "Enviar por WhatsApp",
  className,
}: {
  values: SolicitudFormValues;
  label?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => openWhatsApp(values)}
    >
      <MessageCircle className="size-4" />
      {label}
    </Button>
  );
}
