import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  SolicitudPresupuestoForm,
  WhatsAppFromValuesButton,
  type SolicitudFormValues,
} from "@/components/solicitud-presupuesto-form";
import { AYOX_SERVICE_NAMES } from "@/lib/ayox-service-names";
import { createSolicitud, getActiveSolicitud, updateSolicitud } from "@/lib/solicitud-presupuesto";

export function LoginPresupuestoBlock() {
  const [ready, setReady] = useState(false);
  const [solicitudId, setSolicitudId] = useState<string | null>(null);
  const [initial, setInitial] = useState<SolicitudFormValues | null>(null);
  const [liveValues, setLiveValues] = useState<SolicitudFormValues | null>(null);

  useEffect(() => {
    const active = getActiveSolicitud();
    if (active) {
      setSolicitudId(active.id);
      setInitial({
        nombre: active.nombre,
        telefono: active.telefono,
        servicio: active.servicio,
        urgencia: active.urgencia,
        mensaje: active.mensaje,
      });
    }
    setReady(true);
  }, []);

  if (!ready || !initial) return null;

  const current = liveValues ?? initial;

  const persist = (values: SolicitudFormValues) => {
    if (solicitudId) updateSolicitud(solicitudId, values);
    else {
      const created = createSolicitud(values);
      setSolicitudId(created.id);
    }
  };

  return (
    <div className="auth-demo-box mt-6 rounded-3xl border border-border bg-secondary p-4">
      <p className="eyebrow">Tu solicitud de presupuesto</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Datos guardados desde la web. Puedes revisarlos antes de entrar al panel o enviarlos de nuevo
        por WhatsApp.
      </p>
      <div className="mt-4">
        <SolicitudPresupuestoForm
          serviceOptions={[...AYOX_SERVICE_NAMES]}
          initialValues={initial}
          submitLabel="Guardar cambios"
          onSubmit={(values) => persist(values)}
          onValuesChange={setLiveValues}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <WhatsAppFromValuesButton values={current} label="WhatsApp" />
          <Link to="/panel" search={{ view: "presupuesto" }} className="text-sm font-semibold text-accent hover:underline">
            Ver en el panel →
          </Link>
        </div>
      </div>
    </div>
  );
}
