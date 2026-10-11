import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone, MessageCircle, Clock, MapPin, ShieldCheck, ArrowRight, CheckCircle2,
  Star, ChevronDown, Wrench, Building2, Paintbrush,
  Droplets, DoorOpen, Wind, Hammer, Layers, Menu, Package, KeyRound, Users, LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BusinessReviews } from "@/components/business-reviews";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import { PageSection, SectionHeader } from "@/components/page-section";
import { SolicitudPresupuestoForm } from "@/components/solicitud-presupuesto-form";
import { useAuth } from "@/hooks/auth-context";
import { STAFF_ROLES } from "@/lib/auth-demo";
import { AYOX_SERVICE_NAMES } from "@/lib/ayox-service-names";
import { createSolicitud, emptySolicitudFields, openWhatsApp } from "@/lib/solicitud-presupuesto";
import heroAsset from "@/assets/reformas.jpg.asset.json";
const assetFiles = import.meta.glob<{ default: { url: string } }>("../assets/*.asset.json", { eager: true });
const serviceImage = (slug: string) => assetFiles[`../assets/${slug}.jpg.asset.json`]?.default.url;
const TEL = "tel:+34666854310";
const WA = "https://wa.me/34666854310";
const EMAIL = "mailto:ayoxservicios@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AYOX Servicios | Servicios Integrales 24h en Alicante" },
      { name: "description", content: "Fontanería, persianas, aire acondicionado, pintura, reformas, cerrajería y mantenimiento en Alicante. Urgencias 24 horas, presupuesto cerrado y equipo local." },
      { property: "og:title", content: "AYOX Servicios · Servicios Integrales 24h en Alicante" },
      { property: "og:description", content: "Cuando algo se rompe, alguien contesta. Equipo local en Alicante, urgencias 24h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      
      
    ],
  }),
  component: Index,
});

const services = [
  { slug: "fontaneria", name: "Fontanería", icon: Droplets, items: ["Fugas de agua y humedades", "Atascos de fregadero y baño", "Calentadores y termos", "Grifos y monomandos", "Desagües y bajantes", "Sustitución de tuberías", "Cisternas y sanitarios", "Detección sin obra"] },
  { slug: "persianas", name: "Persianas", icon: Layers, items: ["Cintas y recogedores", "Lamas rotas", "Motorización", "Poleas y ejes", "Cierres metálicos de local", "Mosquiteras"] },
  { slug: "aire-acondicionado", name: "Aire acondicionado", icon: Wind, items: ["Instalación split y conductos", "Recarga de gas", "Limpieza de filtros", "Reparación de averías", "Mantenimiento anual", "Bomba de calor"] },
  { slug: "pintura", name: "Pintura", icon: Paintbrush, items: ["Viviendas completas", "Zonas comunes", "Locales y oficinas", "Fachadas", "Alisado de paredes", "Esmaltado de carpintería"] },
  { slug: "reformas-y-albanileria", name: "Reformas y albañilería", icon: Hammer, items: ["Baños completos", "Cocinas", "Alicatado y solado", "Pequeñas obras", "Tabiquería", "Impermeabilización"] },
  { slug: "mantenimiento-de-comunidades", name: "Mantenimiento de comunidades", icon: Users, items: ["Mantenimiento de comunidades", "Zonas comunes", "Portales y escaleras", "Atención prioritaria", "Tarifas pactadas", "Averías recurrentes"] },
  { slug: "reformas-de-locales-y-comercios", name: "Reformas de locales y comercios", icon: Building2, items: ["Adecuación de locales", "Oficinas", "Reforma de escaparates", "Mantenimiento mensual", "Trabajos fuera de horario", "Coordinación de gremios"] },
  { slug: "pladur", name: "Pladur", icon: Layers, items: ["Tabiques y divisiones", "Falsos techos", "Armarios empotrados", "Aislamiento acústico", "Trasdosados", "Focos y registros"] },
  { slug: "montaje-de-muebles", name: "Montaje de muebles", icon: Package, items: ["Muebles de IKEA", "Armarios y vestidores", "Estanterías y baldas", "Cocinas de montaje", "Anclaje a pared", "Retirada de embalajes"] },
  { slug: "cerrajeria", name: "Cerrajería", icon: KeyRound, items: ["Apertura de puertas", "Cambio de cerradura", "Bombines antibumping", "Cerraduras de seguridad", "Puertas acorazadas", "Persianas metálicas", "Buzones y candados", "Copia de llaves"] },
];

const zonas = ["Alicante centro", "Playa de San Juan", "El Campello", "Mutxamel", "Sant Joan d'Alacant", "San Vicente del Raspeig", "Albufereta", "Villafranqueza"];

const faqs = [
  { q: "¿Cuánto cuesta que vengáis?", a: "El desplazamiento y la mano de obra están en la página de precios. Antes de empezar cualquier reparación te damos un presupuesto cerrado; si no te encaja, no hay compromiso." },
  { q: "¿Cuánto tardáis en llegar?", a: "Depende de la zona y de la hora. En una urgencia te decimos por teléfono un tiempo real, no uno de folleto — y si vamos a tardar, lo dices tú si esperas o no." },
  { q: "¿Qué métodos de pago aceptáis?", a: "Efectivo, tarjeta, Bizum y transferencia." },
  { q: "¿Trabajáis fines de semana y festivos?", a: "Sí. Las urgencias se atienden todos los días del año. Los trabajos programados los concertamos de lunes a sábado." },
  { q: "¿Puedo mandaros una foto antes?", a: "Es lo que más ayuda. Mandándonos una foto por WhatsApp muchas veces sabemos qué pieza llevar, y eso ahorra una visita." },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { user } = useAuth();

  const navLinks: [string, string][] = [
    ["Servicios", "servicios"],
    ["Precios", "precios"],
    ["Nosotros", "nosotros"],
    ["Opiniones", "opiniones"],
    ["Contacto", "reservar"],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <div className="utility-bar"><div className="page-width flex items-center justify-between gap-4 py-2"><span className="flex items-center gap-2"><Clock className="size-3.5" /> Atención de urgencias 24 horas</span><a href={EMAIL} className="hidden sm:block">ayoxservicios@gmail.com</a><span className="flex items-center gap-2"><MapPin className="size-3.5" /> Alicante y alrededores</span></div></div>
      <header className="site-header">
        <div className="page-width flex h-20 items-center justify-between gap-5">
          <a href="#" className="brand" aria-label="AYOX Servicios, inicio">AYOX<span className="text-accent">.</span><small>SERVICIOS INTEGRALES</small></a>
          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
            {navLinks.map(([name, id]) => (
              <a key={id} href={`#${id}`} className="transition-colors hover:text-accent">{name}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            {user && STAFF_ROLES.includes(user.role) ? (
              <Button asChild className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/panel">Ir al panel</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="hidden text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                <Link to="/login">
                  <LogIn className="size-4" aria-hidden />
                  Iniciar sesión
                </Link>
              </Button>
            )}
            <Button asChild className="hidden sm:inline-flex" variant="outline"><a href={TEL}><Phone />666 854 310</a></Button>
            <Button asChild className="hidden lg:inline-flex bg-accent text-accent-foreground hover:bg-accent/90"><a href="#reservar">Pedir presupuesto <ArrowRight /></a></Button>
            <Button variant="outline" className="lg:hidden" aria-expanded={menuOpen} aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><Menu /></Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="page-width grid gap-4 border-t border-border py-5 lg:hidden" aria-label="Menú móvil">
            {navLinks.map(([name, id]) => (
              <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{name}</a>
            ))}
            <a href="#faq" onClick={() => setMenuOpen(false)}>Preguntas frecuentes</a>
            {user && STAFF_ROLES.includes(user.role) ? (
              <Link to="/panel" onClick={() => setMenuOpen(false)} className="font-semibold text-accent">
                Ir al panel
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 font-semibold text-foreground"
              >
                <LogIn className="size-4" aria-hidden />
                Iniciar sesión (equipo)
              </Link>
            )}
          </nav>
        )}
      </header>
      <section className="home-cover"><img src={heroAsset.url} alt="Trabajo de albañilería" className="cover-photo" fetchPriority="high" /><div className="cover-shade" /><div className="page-width relative py-16 lg:py-20"><p className="cover-eyebrow">HOGARES · COMUNIDADES · NEGOCIOS</p><h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">AYOX Servicios.<br />Reparaciones y reformas<br />en Alicante.</h1><p className="mt-6 max-w-lg text-base leading-relaxed text-cover-foreground/85 sm:text-lg">Fontanería, cerrajería, climatización y mantenimiento. Un equipo local para las urgencias de hoy y los proyectos de mañana.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90"><a href="#reservar">Solicitar presupuesto <ArrowRight /></a></Button><Button asChild size="lg" variant="outline" className="h-12 border-cover-foreground/40 bg-transparent text-cover-foreground hover:bg-cover-foreground/10 hover:text-cover-foreground"><a href={TEL}><Phone />Urgencias 24h</a></Button></div><a href="#opiniones" className="mt-9 inline-flex items-center gap-3 text-sm"><Star className="size-4 fill-current text-rating" /><strong>4,7 / 5 en Google</strong><span className="text-cover-foreground/70">27 reseñas</span><ArrowRight className="size-4" /></a></div></section>

      <main className="page-main">
      <section className="trust-strip" aria-label="Ventajas">
        <div className="page-width grid gap-4 py-8 md:grid-cols-3">
          {[{ icon: Phone, title: "Atención directa", text: "Un equipo local, sin centralitas." }, { icon: ShieldCheck, title: "Presupuesto antes de empezar", text: "Conoce el importe de tu reparación." }, { icon: MessageCircle, title: "Cuéntanos tu avería", text: "Envíanos una foto por WhatsApp." }].map((x) => (
            <div key={x.title} className="trust-strip-item flex items-center gap-4">
              <x.icon className="size-6 shrink-0 text-accent" />
              <div><p className="text-sm font-bold">{x.title}</p><p className="mt-1 text-xs text-muted-foreground">{x.text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <PageSection id="servicios" variant="default">
        <SectionHeader
          eyebrow="Qué hacemos"
          title="Un equipo. Todos los servicios."
          description="Reparaciones puntuales, mantenimiento y reformas. Encuentra el servicio que necesitas y consulta todos los trabajos que realizamos."
          action={
            <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
              <a href="#reservar">Pedir presupuesto <ArrowRight className="size-4" /></a>
            </Button>
          }
        />

        <div className="service-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.slug} className="service-item service-card group flex flex-col">
              <div className="relative overflow-hidden">
                <img src={serviceImage(s.slug)} alt={s.name} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/90 text-accent backdrop-blur">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <div className="service-card-body">
                <h3 className="font-display text-xl font-bold">{s.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cómo lo hacemos</p>
                <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{it}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex gap-2 pt-6">
                  <a href="#reservar" className="flex-1 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90">Pedir presupuesto</a>
                  <a href={TEL} aria-label={`Llamar por ${s.name}`} className="flex items-center justify-center rounded-md border border-border px-3 transition hover:border-accent hover:text-accent"><Phone className="h-4 w-4" /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection id="precios" variant="muted">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Precios"
              title="Precios claros desde el principio."
              description="Consulta las tarifas orientativas de nuestros servicios. El importe definitivo se confirma antes de comenzar el trabajo."
            />
            <p className="-mt-6 max-w-xl leading-relaxed text-muted-foreground">
              La tarifa por servicio está en la página de precios, siempre actualizada. Los importes que ves allí son orientativos: el presupuesto en firme te lo damos en tu domicilio.
            </p>
            <Button asChild className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
              <a href="https://ayox-servicios.es/precios" target="_blank" rel="noopener noreferrer">
                Ver la tarifa completa <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
          <div className="grid gap-3">
            {[
              { icon: ShieldCheck, t: "Presupuesto cerrado", d: "Antes de empezar cualquier reparación te damos un presupuesto cerrado; si no te encaja, no hay compromiso." },
              { icon: Clock, t: "Respuesta el mismo día", d: "Las solicitudes de presupuesto se responden el mismo día. Las urgencias, al momento por teléfono." },
              { icon: Wrench, t: "Sin sorpresas", d: "Los importes publicados son orientativos; el precio en firme se confirma en tu domicilio antes de trabajar." },
            ].map((c) => (
              <div key={c.t} className="info-card flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent"><c.icon className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-lg font-bold">{c.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection id="nosotros" variant="dark">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Nosotros"
              title="Cerca de ti. Con oficio propio."
            />
            <p className="-mt-4 text-lg leading-relaxed text-primary-foreground/80">
              Cuando llamas a AYOX Servicios no entras en una cola. Contesta alguien que conoce Alicante, que sabe quién está más cerca y que puede decirte a qué hora llegamos.
            </p>
            <p className="mt-4 leading-relaxed text-primary-foreground/80">
              Trabajamos con oficio propio. El profesional que va a tu casa es el mismo que fue la última vez, no un autónomo distinto cada semana.
            </p>
            <p className="mt-4 leading-relaxed text-primary-foreground/80">
              Estamos en Calle Valdés, 03001 Alicante, y cubrimos la ciudad y su comarca de lunes a domingo.
            </p>
            <Button asChild className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
              <a href="#reservar">Pedir presupuesto <ArrowRight className="size-4" /></a>
            </Button>
          </div>
          <div className="info-card border-l-4 border-l-accent lg:ml-4">
            <p className="font-display text-3xl font-bold">Hogares, comunidades<br />y negocios.</p>
            <p className="mt-5 max-w-md leading-relaxed text-primary-foreground/75">Desde una fuga de agua hasta una reforma completa. Coordinamos los distintos oficios para que tengas un único contacto.</p>
            <div className="mt-8 divide-y divide-primary-foreground/15">
              {["Reparaciones y urgencias 24h", "Mantenimiento de comunidades", "Reformas de viviendas y locales"].map((t) => (
                <p key={t} className="flex items-center gap-3 py-4 text-sm"><ArrowRight className="size-4 text-accent" />{t}</p>
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection id="zona" variant="contrast">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="Zona"
              title="Dónde llegamos"
              description="Alicante y alrededores. Si tu calle no está en la lista, llámanos igualmente."
              action={
                <Button asChild variant="outline">
                  <a href={TEL}><Phone className="size-4" /> Consultar mi zona</a>
                </Button>
              }
            />
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {zonas.map((z) => (
              <li key={z} className="info-card flex items-center gap-3 py-4 text-sm font-medium transition hover:border-accent">
                <MapPin className="h-4 w-4 shrink-0 text-accent" />{z}
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <BusinessReviews />

      <PageSection id="faq" variant="default" className="pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="section-title">Antes de llamar</h2>
        </div>
        <div className="mx-auto mt-2 max-w-3xl divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <Button variant="ghost"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="h-auto w-full justify-between gap-4 whitespace-normal px-6 py-5 text-left font-display text-base font-semibold hover:bg-secondary hover:text-foreground"
                aria-expanded={openFaq === i}
              >
                {f.q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-accent transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </Button>
              {openFaq === i && (
                <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="reservar" variant="dark">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Reservar"
              title="Cuéntanos qué pasa"
              description="Solicita una visita para tu reparación o reforma. Si tienes fotografías de la avería, puedes enviarlas por WhatsApp."
            />
            <div className="mt-10 grid gap-4">
              <a href={TEL} className="flex items-center gap-5 border-b border-primary-foreground/20 py-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent"><Phone className="h-6 w-6" /></span>
                <div><p className="font-display text-lg font-bold">+34 666 854 310</p><p className="text-sm text-primary-foreground/70">Teléfono · 24 h</p></div>
              </a>
              <a href={WA} className="flex items-center gap-5 border-b border-primary-foreground/20 py-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent"><MessageCircle className="h-6 w-6" /></span>
                <div><p className="font-display text-lg font-bold">WhatsApp</p><p className="text-sm text-primary-foreground/70">Mándanos una foto</p></div>
              </a>
              <a href={EMAIL} className="flex items-center gap-5 border-b border-primary-foreground/20 py-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent"><DoorOpen className="h-6 w-6" /></span>
                <div><p className="font-display text-lg font-bold">ayoxservicios@gmail.com</p><p className="text-sm text-primary-foreground/70">Email</p></div>
              </a>
              <div className="flex items-center gap-5 py-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent"><MapPin className="h-6 w-6" /></span>
                <div><p className="font-display text-lg font-bold">Calle Valdés · 03001 Alicante</p><p className="text-sm text-primary-foreground/70">Base</p></div>
              </div>
            </div>
          </div>

          <div className="contact-form h-fit rounded-md bg-card p-6 text-card-foreground sm:p-8">
            <h3 className="font-display text-2xl font-bold">Solicitar una visita</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Envíanos tu solicitud por WhatsApp. Guardamos una copia en tu navegador y el equipo la
              gestiona desde el panel interno.
            </p>
            <div className="mt-4">
              <SolicitudPresupuestoForm
                serviceOptions={[...AYOX_SERVICE_NAMES]}
                initialValues={emptySolicitudFields()}
                onSubmit={(values) => {
                  createSolicitud(values);
                  openWhatsApp(values);
                }}
              />
            </div>
          </div>
        </div>
      </PageSection>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-extrabold">AYOX<span className="text-accent">.</span> Servicios</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Servicios Integrales 24h en Alicante y alrededores. Urgencias 24 horas.</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-foreground">Servicios</p>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-muted-foreground">
              {services.map((s) => <li key={s.slug}><a href="#servicios" className="transition hover:text-accent">{s.name}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-foreground">Contacto</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li><a href={TEL} className="transition hover:text-accent">+34 666 854 310</a></li>
              <li><a href={WA} className="transition hover:text-accent">WhatsApp</a></li>
              <li><a href={EMAIL} className="transition hover:text-accent">ayoxservicios@gmail.com</a></li>
              <li>Calle Valdés · 03001 Alicante</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
            <span>© {new Date().getFullYear()} AYOX Servicios · Servicios Integrales 24h. Titular: Mohamed Ayoub Benmarzouk · NIF/NIE Y8933023K</span>
            <span className="flex gap-4">
              <a href="https://ayox-servicios.es/aviso-legal" className="hover:text-accent">Aviso legal</a>
              <a href="https://ayox-servicios.es/privacidad" className="hover:text-accent">Privacidad</a>
              <a href="https://ayox-servicios.es/cookies" className="hover:text-accent">Cookies</a>
            </span>
          </div>
        </div>
      </footer>

      <WhatsAppFloatButton />
    </div>
  );
}
