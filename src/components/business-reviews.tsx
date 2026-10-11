import { ArrowUpRight, Mail, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import workAsset from "@/assets/trabajo.jpg.asset.json";

const MAPS = "https://maps.app.goo.gl/xqambCjS2vLc34x89";
const TEL = "tel:+34666854310";
const EMAIL = "mailto:ayoxservicios@gmail.com";

const reviews = [
  {
    author: "rrnex33",
    date: "1 octubre 2026",
    text: "Muy rápido y profesional",
    url: "https://www.google.com/maps/contrib/113674495599642727864/reviews",
  },
  {
    author: "Eva “Almark” González",
    date: "29 septiembre 2026",
    text: "Una instalación de fontanería perfecta muchas gracias ayox por tu colaboración",
    url: "https://www.google.com/maps/contrib/108527810166910976886/reviews",
  },
  {
    author: "Elena BN",
    date: "28 septiembre 2026",
    text: "Buen trabajo\nPuntual el mismo día que llame me atendió y me puso la pila de lavado\nEstoy muy contenta\nGracias",
    url: "https://www.google.com/maps/contrib/103860448120628776718/reviews",
  },
];

export function BusinessReviews() {
  return (
    <section id="opiniones" className="page-section page-section--muted scroll-mt-28">
      <div className="page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AYOX en Google</p>
            <h2>
              La confianza se gana
              <br />
              en cada trabajo.
            </h2>
          </div>
          <Button asChild variant="outline">
            <a href={MAPS} target="_blank" rel="noopener noreferrer">
              Ver todas las opiniones <ArrowUpRight />
            </a>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-5 border-y border-border py-6">
          <span className="font-display text-4xl font-bold">
            4,7<span className="text-lg text-muted-foreground"> / 5</span>
          </span>
          <div>
            <div className="flex gap-1 text-rating" aria-label="Valoración de 4,7 sobre 5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">27 reseñas en Google</p>
          </div>
          <p className="ml-auto text-xs text-muted-foreground">Consultado el 9 de octubre de 2026</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <article className="review-card" key={r.author}>
              <div className="flex gap-1 text-rating" aria-label="5 estrellas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="my-6 whitespace-pre-line text-base leading-relaxed">
                “{r.text}”
              </blockquote>
              <div className="mt-auto border-t border-border pt-5">
                <a
                  className="font-semibold hover:underline"
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.author} <ArrowUpRight className="inline size-3.5" />
                </a>
                <p className="mt-1 text-xs text-muted-foreground">{r.date} · Google</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <figure>
            <img
              src={workAsset.url}
              alt="Reforma de albañilería realizada por AYOX en Alicante"
              loading="lazy"
              className="w-full rounded-md object-contain"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Reforma y albañilería · Foto de{" "}
              <a
                href="https://maps.google.com/maps/contrib/104987134451890783201"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Ayox - Servicios Integrales 24h
              </a>{" "}
              en Google.
            </figcaption>
          </figure>

          <div>
            <p className="eyebrow">Encuéntranos</p>
            <h3 className="mt-3 font-display text-2xl font-bold">Ayox · Servicios Integrales 24h</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Trabajamos en Alicante y alrededores. Para ver la ficha del negocio, la ubicación exacta
              y más opiniones, ábrela en Google Maps.
            </p>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={TEL}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-accent/40"
                >
                  <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Teléfono</span>
                    <span className="mt-0.5 block text-muted-foreground">666 854 310 · Urgencias 24 h</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={EMAIL}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-accent/40"
                >
                  <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Correo</span>
                    <span className="mt-0.5 block text-muted-foreground">ayoxservicios@gmail.com</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-foreground">Zona</span>
                  <span className="mt-0.5 block text-muted-foreground">
                    Alicante capital, Playa de San Juan, Campello, Mutxamel y comarca
                  </span>
                </span>
              </li>
            </ul>

            <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={MAPS} target="_blank" rel="noopener noreferrer">
                Abrir ficha en Google Maps <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
