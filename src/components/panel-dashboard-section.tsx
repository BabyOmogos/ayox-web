import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { clasificarServicios, listServicios } from "@/lib/panel-servicios";
import { listTrabajadoresActivos } from "@/lib/panel-personal";
import {
  listSolicitudes,
  PRESUPUESTO_ESTADO_LABEL,
  type PresupuestoEstado,
} from "@/lib/solicitud-presupuesto";

const presupuestoChartConfig = {
  pendiente: { label: "Pendiente", color: "var(--chart-4)" },
  aceptado: { label: "Aceptado", color: "var(--chart-2)" },
  rechazado: { label: "Rechazado", color: "var(--chart-3)" },
} satisfies ChartConfig;

const pipelineChartConfig = {
  count: { label: "Trabajos", color: "var(--chart-1)" },
} satisfies ChartConfig;

const servicioChartConfig = {
  count: { label: "Solicitudes", color: "var(--chart-1)" },
} satisfies ChartConfig;

function countByServicio() {
  const map = new Map<string, number>();
  for (const s of listSolicitudes()) {
    const key = s.servicio || "Otro";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function PanelDashboardSection() {
  const data = useMemo(() => {
    const solicitudes = listSolicitudes();
    const servicios = listServicios();
    const etapas = clasificarServicios(servicios);

    const presupuestoEstado = (["pendiente", "aceptado", "rechazado"] as PresupuestoEstado[]).map(
      (estado) => ({
        estado,
        label: PRESUPUESTO_ESTADO_LABEL[estado],
        count: solicitudes.filter((s) => s.estado === estado).length,
        fill: `var(--color-${estado})`,
      }),
    );

    const pipeline = [
      { fase: "Sin revisar", count: etapas.sinRevisar.length },
      { fase: "Asignados", count: etapas.asignados.length },
      { fase: "Completados", count: etapas.completados.length },
    ];

    return {
      totalPresupuestos: solicitudes.length,
      pendientes: solicitudes.filter((s) => s.estado === "pendiente").length,
      serviciosActivos: etapas.sinRevisar.length + etapas.asignados.length,
      completados: etapas.completados.length,
      trabajadores: listTrabajadoresActivos().length,
      presupuestoEstado,
      pipeline,
      porServicio: countByServicio(),
    };
  }, []);

  const kpis = [
    { label: "Presupuestos", value: data.totalPresupuestos },
    { label: "Pendientes de decisión", value: data.pendientes },
    { label: "Servicios en curso", value: data.serviciosActivos },
    { label: "Trabajos completados", value: data.completados },
    { label: "Técnicos activos", value: data.trabajadores },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="panel-card px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{k.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel-card p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground">Presupuestos por estado</h3>
          <p className="mt-1 text-xs text-muted-foreground">Datos guardados en este navegador.</p>
          <ChartContainer config={presupuestoChartConfig} className="mx-auto mt-4 h-[260px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
              <Pie
                data={data.presupuestoEstado}
                dataKey="count"
                nameKey="label"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.presupuestoEstado.map((entry) => (
                  <Cell key={entry.estado} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="panel-card p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground">Pipeline de servicios</h3>
          <p className="mt-1 text-xs text-muted-foreground">Desde aceptación hasta cierre.</p>
          <ChartContainer config={pipelineChartConfig} className="mt-4 h-[260px] w-full">
            <BarChart data={data.pipeline} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="fase" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="panel-card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Solicitudes por tipo de servicio</h3>
        <p className="mt-1 text-xs text-muted-foreground">Top 6 gremios en presupuestos.</p>
        {data.porServicio.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">Aún no hay solicitudes registradas.</p>
        ) : (
          <ChartContainer config={servicioChartConfig} className="mt-4 h-[280px] w-full">
            <BarChart data={data.porServicio} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fontSize: 11 }}
              />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
