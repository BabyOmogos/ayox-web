import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  LogIn,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BusinessReviews } from "@/components/business-reviews";
import { PlumbingFaqSection } from "@/components/plumbing-faq-section";
import { PageSection, SectionHeader } from "@/components/page-section";
import { SolicitudPresupuestoForm } from "@/components/solicitud-presupuesto-form";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import { useAuth } from "@/hooks/auth-context";
import { STAFF_ROLES } from "@/lib/auth-demo";
import { AYOX_SERVICE_NAMES } from "@/lib/ayox-service-names";
import {
  FONTANERIA_SERVICES,
  GALLERY_ITEMS,
  PRICE_BANDS,
} from "@/lib/fontaneria-public";
import { createSolicitud, emptySolicitudFields, openWhatsApp } from "@/lib/solicitud-presupuesto";

const TEL = "tel:+34666854310";
const WA = "https://wa.me/34666854310";
const EMAIL = "mailto:ayoxservicios@gmail.com";

const zonas = [
  "Alicante centro",
  "Playa de San Juan",
  "El Campello",
  "Mutxamel",
  "Sant Joan d'Alacant",
  "San Vicente del Raspeig",
  "Albufereta",
  "Villafranqueza",
];

const faqs = [
  {
    q: "¿Atendéis urgencias de fontanería?",
    a: "Sí, 24 horas. Llama al 666 854 310 y te indicamos cuándo podemos estar en tu domicilio.",
  },
  {
    q: "¿Cuánto cuesta una visita?",
    a: "Te damos tarifas orientativas en la web. El importe cerrado se confirma en casa antes de empezar.",
  },
  {
    q: "¿Hacéis reformas de baño completas?",
    a: "Sí: desagües, grifería, plato o ducha y coordinación de alicatado. Presupuesto por escrito.",
  },
  {
    q: "¿Puedo enviar una foto por WhatsApp?",
    a: "Es lo más útil. Muchas veces identificamos la pieza y el trabajo antes de la visita.",
  },
  {
    q: "¿Trabajáis en comunidades de vecinos?",
    a: "Sí: bajantes, contadores, averías en zonas comunes y mantenimiento programado.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AYOX Fontanería | Urgencias y reformas de baño en Alicante" },
      {
        name: "description",
        content:
          "Fontanería profesional en Alicante: fugas, atascos, calentadores, baños y desagües. Urgencias 24 h, presupuesto cerrado y fotos reales de nuestros trabajos.",
      },
      { property: "og:title", content: "AYOX Fontanería · Alicante" },
      {
        property: "og:description",
        content: "Especialistas en fontanería. Urgencias 24 h, reformas de baño y instalaciones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks: [string, string][] = [
    ["Servicios", "servicios"],
    ["Trabajos", "trabajos"],
    ["Qué incluye", "incluye"],
    ["Precio", "precios"],
    ["Zonas", "zona"],
    ["Contacto", "reservar"],
  ];

  const heroBullets = [
    "Urgencias de fontanería 24 h",
    "Presupuesto cerrado antes de obrar",
    "Equipo local en Alicante",
    "Sin multiservicios: solo fontanería",
  ];

  const includeItems = [
    {
      icon: Clock,
      title: "Respuesta rápida",
      text: "Te damos cita el mismo día laborable cuando es posible.",
    },
    {
      icon: Wrench,
      title: "Reparaciones habituales",
      text: "Fugas, atascos, grifería, calentadores y desagües.",
    },
    {
      icon: ShieldCheck,
      title: "Mano de obra clara",
      text: "Sabes qué pagas antes de que empecemos la obra.",
    },
    {
      icon: Users,
      title: "Fontanero de confianza",
      text: "El mismo equipo te atiende por teléfono y en casa.",
    },
  ];

  return (
    <div className="plumbing-site min-h-screen bg-background text-foreground font-body antialiased">
      {/* Fondo de tuberías en toda la página */}
      <div className="plumbing-watermark-bg" aria-hidden="true">
        <div className="plumbing-watermark-track plumbing-watermark-track--left" />
        <div className="plumbing-watermark-track plumbing-watermark-track--right" />
      </div>

      {/* Barra superior y navegación fijas (sticky al hacer scroll) */}
      <div className="plumbing-sticky-bar">
        <div className="plumbing-utility">
          <div className="page-width flex flex-wrap items-center justify-between gap-3 py-2">
            <span className="flex items-center gap-2 font-semibold">
              <Droplets className="size-3.5" aria-hidden />
              Fontanería · Urgencias 24 h
            </span>
            <a href={EMAIL} className="hidden hover:underline sm:block">
              ayoxservicios@gmail.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5" aria-hidden /> Alicante y comarca
            </span>
          </div>
        </div>

        <header className="plumbing-header">
          <div className="page-width flex h-[4.5rem] items-center justify-between gap-4">
            <a href="#" className="leading-tight" aria-label="AYOX Fontanería, inicio">
              <span className="plumbing-brand-word">
                <span className="brand-navy">AY</span>
                <span className="brand-cyan">OX</span>
              </span>
              <small className="mt-1 block text-[10px] font-semibold tracking-wide text-muted-foreground">
                servicios de fontanería · Alicante
              </small>
            </a>
            <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
              {navLinks.map(([name, id]) => (
                <a key={id} href={`#${id}`} className="transition-colors hover:text-accent">
                  {name}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {user && STAFF_ROLES.includes(user.role) ? (
                <Button asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/panel">Panel</Link>
                </Button>
              ) : (
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/login">
                    <LogIn className="size-4" aria-hidden /> Equipo
                  </Link>
                </Button>
              )}
              <a href={TEL} className="plumbing-btn-phone shrink-0 whitespace-nowrap">
                <Phone className="size-4 shrink-0" aria-hidden />
                <span>666 854 310</span>
              </a>
              <Button asChild size="sm" className="hidden lg:inline-flex bg-primary text-primary-foreground">
                <a href="#reservar">
                  Pedir presupuesto <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-expanded={menuOpen}
                aria-label="Abrir menú"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu />
              </Button>
            </div>
          </div>
          {menuOpen ? (
            <nav className="page-width grid gap-3 border-t border-border py-4 lg:hidden" aria-label="Menú móvil">
              {navLinks.map(([name, id]) => (
                <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {name}
                </a>
              ))}
              <a href={TEL} onClick={() => setMenuOpen(false)} className="font-semibold text-accent">
                Llamar 666 854 310
              </a>
            </nav>
          ) : null}
        </header>
      </div>

      <section className="plumbing-hero-tufont">
        <div className="page-width grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <h1 className="plumbing-hero-title">
              Fontanero en Alicante a domicilio, con urgencias 24 horas
            </h1>
            <p className="plumbing-hero-lead">
              Evita esperas, precios imprevistos y malas experiencias. Con AYOX tienes fontanería
              clara, rápida y sin sorpresas: servicios, fotos de obra y presupuesto cerrado.
            </p>
            <ul className="plumbing-checklist">
              {heroBullets.map((b) => (
                <li key={b}>
                  <CheckCircle2 className="size-5" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
            <a href="#reservar" className="plumbing-btn-dark">
              ¡Necesito un fontanero en ALICANTE!
            </a>
          </div>
          <div className="plumbing-hero-visual">
            <div className="plumbing-hero-ring">
              <img
                src="/assets/galeria/hero-bano.png"
                alt="Reforma de baño realizada por AYOX Fontanería"
                fetchPriority="high"
              />
              <p className="plumbing-hero-offer">
                Presupuesto cerrado
                <br />
                antes de empezar
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="plumbing-lead-strip" aria-label="Contacto rápido">
        <div className="page-width plumbing-lead-inner">
          <p>¿Quieres presupuesto hoy? Cuéntanos la avería o mándanos una foto.</p>
          <a href="#reservar" className="plumbing-lead-cta">
            Solicitar visita
          </a>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[var(--tufont-teal)] hover:underline">
            WhatsApp con foto
          </a>
        </div>
      </section>

      <main className="page-main">
        <PageSection id="servicios" variant="default" className="plumbing-section-servicios !border-t-0">
          <SectionHeader
            eyebrow="Servicios de fontanería"
            title="Lo que resolvemos cada día"
            description="Seis líneas de trabajo claras. Elige la tuya y pide presupuesto sin rodeos."
            action={
              <a href={TEL} className="plumbing-btn-phone shrink-0">
                <Phone className="size-4" aria-hidden /> Urgencia ahora
              </a>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {FONTANERIA_SERVICES.map((s) => (
              <article key={s.id} className="plumbing-service-card flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-3 top-3 flex size-10 items-center justify-center rounded-md bg-[var(--tufont-cyan)] text-[var(--tufont-navy)] shadow-sm">
                    <s.icon className="size-5" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex gap-2 pt-5">
                    <a href="#reservar" className="plumbing-service-cta">
                      Pedir presupuesto
                    </a>
                    <a
                      href={WA}
                      className="plumbing-service-wa"
                      aria-label={`WhatsApp ${s.title}`}
                    >
                      <MessageCircle className="size-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection id="trabajos" variant="default" className="plumbing-section-trabajos">
          <SectionHeader
            eyebrow="Trabajos realizados"
            title="Fontanería hecha en Alicante"
            description="Fotos de reformas de baño, desagües, bombas de presión e instalaciones recientes."
          />
          <div className="plumbing-gallery-grid">
            {GALLERY_ITEMS.map((item, i) => (
              <figure
                key={item.src}
                className={`plumbing-gallery-item ${i === 0 ? "plumbing-gallery-item--tall plumbing-gallery-item--wide" : i === 3 ? "plumbing-gallery-item--wide" : ""}`}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption className="plumbing-gallery-tag">{item.tag}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="plumbing-btn-phone inline-flex px-6 py-3 text-base">
              Quiero un trabajo así <ArrowRight className="size-4" />
            </a>
          </div>
        </PageSection>

        <section className="plumbing-editorial">
          <div className="page-width grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <h2>Las averías por las que más nos llaman en Alicante</h2>
              <p className="mt-4">
                En viviendas de los años 70–90 siguen vivas muchas tuberías y griferías originales.
                En el centro y barrios cercanos, la humedad castiga juntas y latiguillos. En vivienda
                más nueva, lo habitual son calentadores, monomandos y atascos en cocina.
              </p>
            </div>
            <ul className="mt-2 space-y-3 text-sm font-medium">
              {[
                "Griferías y cisternas con pérdidas continuas.",
                "Atascos en fregadero, lavabo o ducha.",
                "Fugas en tuberías visibles y llaves de paso.",
                "Calentadores que no encienden o pierden agua.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--tufont-teal)]" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PageSection id="incluye" variant="default">
          <SectionHeader
            eyebrow="Qué incluye trabajar con AYOX"
            title="Fontanería directa, sin intermediarios"
            description="No somos un marketplace ni un seguro: un equipo de fontanería local con condiciones claras."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {includeItems.map((item) => (
              <article key={item.title} className="plumbing-include-card">
                <item.icon className="size-9" aria-hidden />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </PageSection>

        <section className="plumbing-trust border-y border-border" aria-label="Ventajas">
          <div className="page-width grid gap-4 py-8 md:grid-cols-3">
            {[
              { icon: Phone, title: "Contesta un fontanero", text: "Sin centralitas ni filas de call center." },
              { icon: ShieldCheck, title: "Precio antes de obrar", text: "Presupuesto cerrado en tu casa." },
              { icon: MessageCircle, title: "Foto por WhatsApp", text: "Llevamos el material adecuado a la primera." },
            ].map((x) => (
              <div key={x.title} className="trust-strip-item flex items-center gap-4 bg-card/80">
                <x.icon className="size-6 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-sm font-bold">{x.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{x.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PageSection id="precios" variant="muted">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div>
              <SectionHeader
                eyebrow="Precio"
                title="Transparencia antes de la visita"
                description="Tarifas orientativas. El importe definitivo se confirma en tu domicilio, por escrito."
              />
              <div className="plumbing-price-spotlight mt-4 max-w-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Visita y diagnóstico orientativo
                </p>
                <p className="price-big mt-2">{PRICE_BANDS[0]?.price ?? "Desde 45 €"}</p>
                <p className="mt-2 text-sm text-muted-foreground">Urgencias y reformas: presupuesto cerrado</p>
                <Button asChild className="mt-6 w-full bg-primary text-primary-foreground">
                  <a href={TEL}>
                    <Phone className="size-4" /> Contratar / consultar
                  </a>
                </Button>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {PRICE_BANDS.map((b) => (
                <li key={b.label} className="info-card">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--tufont-teal)]">{b.hint}</p>
                  <p className="mt-2 font-display text-lg font-bold">{b.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{b.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </PageSection>

        <PageSection id="diferencia" variant="default">
          <SectionHeader
            eyebrow="Por qué AYOX"
            title="¿En qué nos diferenciamos de buscar «a ciegas»?"
            description="Trabajamos como nos gustaría que trabajaran en nuestra casa: puntualidad, rapidez y honestidad."
          />
          <div className="plumbing-compare max-w-3xl">
            <table>
              <thead>
                <tr>
                  <th scope="col">Buscar sin referencias</th>
                  <th scope="col">AYOX Fontanería</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Disponibilidad incierta", "Urgencias 24 h y cita clara"],
                  ["Precio al final, sin cerrar", "Presupuesto antes de obrar"],
                  ["Varios oficios mezclados", "Solo fontanería"],
                  ["Opiniones dispersas", "4,7★ en Google · equipo local"],
                ].map(([bad, good]) => (
                  <tr key={bad}>
                    <td>{bad}</td>
                    <td>{good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#reservar" className="plumbing-btn-dark">
              Solicitar visita
            </a>
            <a href={TEL} className="plumbing-btn-phone">
              <Phone className="size-4" /> 666 854 310
            </a>
          </div>
        </PageSection>

        <PageSection id="nosotros" variant="dark">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-primary-foreground/15">
              <img
                src="/assets/galeria/equipo-ayox.png"
                alt="Equipo AYOX en obra de fontanería"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <SectionHeader eyebrow="AYOX Fontanería" title="Un oficio, bien hecho" />
              <p className="-mt-2 text-lg leading-relaxed text-primary-foreground/85">
                Somos fontaneros en Alicante: instalaciones, urgencias y baños completos. El mismo
                equipo te atiende por teléfono y en la obra.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-primary-foreground/80">
                {[
                  "Materiales homologados y trabajo limpio",
                  "Comunidades, viviendas y locales",
                  "Calle Valdés · 03001 Alicante",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 bg-accent text-accent-foreground">
                <a href="#reservar">Reservar visita</a>
              </Button>
            </div>
          </div>
        </PageSection>

        <PageSection id="zona" variant="contrast">
          <SectionHeader
            eyebrow="Zona"
            title="Fontaneros en Alicante y alrededores"
            description="Desplazamiento rápido en la ciudad y pedanías. ¿Tu calle no aparece? Llámanos."
            action={
              <Button asChild variant="outline">
                <a href={TEL}>
                  <Phone className="size-4" /> Consultar zona
                </a>
              </Button>
            }
          />
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {zonas.map((z) => (
              <li key={z} className="info-card flex items-center gap-2 py-3 text-sm font-medium">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                {z}
              </li>
            ))}
          </ul>
        </PageSection>

        <BusinessReviews />

        <PlumbingFaqSection items={faqs} />

        <section className="plumbing-cta-band py-10">
          <div className="page-width flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-2xl font-bold">¿Fuga o atasco ahora?</p>
              <p className="mt-1 text-sm text-primary-foreground/80">Llama o escribe por WhatsApp con una foto.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <a href={TEL}>
                  <Phone className="size-4" /> 666 854 310
                </a>
              </Button>
              <Button asChild size="lg" className="bg-accent text-accent-foreground">
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        <PageSection id="reservar" variant="default">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Contacto"
                title="Pide presupuesto de fontanería"
                description="Cuéntanos la avería. Si puedes, adjunta foto por WhatsApp después de enviar el formulario."
              />
              <div className="mt-6 space-y-4 text-sm">
                <a href={TEL} className="flex items-center gap-3 font-semibold hover:text-accent">
                  <Phone className="size-5 text-accent" /> +34 666 854 310
                </a>
                <a href={EMAIL} className="block hover:text-accent">
                  ayoxservicios@gmail.com
                </a>
                <p className="text-muted-foreground">Calle Valdés · 03001 Alicante</p>
              </div>
            </div>
            <div className="contact-form rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-xl font-bold">Solicitar visita</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Solo servicios de fontanería. Te respondemos el mismo día laborable.
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

      <footer className="border-t border-border">
        <div className="page-width grid gap-8 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">
              AYOX<span className="text-accent">.</span> Fontanería
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Urgencias 24 h · Reformas de baño · Alicante y comarca.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Servicios</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {FONTANERIA_SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#servicios" className="hover:text-accent">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Contacto</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <a href={TEL} className="hover:text-accent">
                  666 854 310
                </a>
              </li>
              <li>
                <a href={WA} className="hover:text-accent">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={EMAIL} className="hover:text-accent">
                  ayoxservicios@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AYOX Fontanería · Mohamed Ayoub Benmarzouk · NIF/NIE Y8933023K
        </div>
      </footer>

      <WhatsAppFloatButton />
    </div>
  );
}
