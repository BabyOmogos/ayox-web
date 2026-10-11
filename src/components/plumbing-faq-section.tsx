import { HelpCircle, MessageCircle, Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/page-section";

const TEL = "tel:+34666854310";
const WA = "https://wa.me/34666854310";

type FaqItem = { q: string; a: string };

export function PlumbingFaqSection({ items }: { items: FaqItem[] }) {
  return (
    <PageSection id="faq" variant="muted" className="pb-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="section-title mt-2 text-left">Fontanería, sin dudas</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Respuestas rápidas sobre urgencias, precios y reformas. Si tu caso es distinto, llámanos
            o mándanos una foto por WhatsApp.
          </p>
          <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HelpCircle className="size-4 text-accent" aria-hidden />
              ¿No encuentras tu respuesta?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Te orientamos por teléfono en un minuto.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild size="sm" className="bg-accent text-accent-foreground">
                <a href={TEL}>
                  <Phone className="size-4" /> 666 854 310
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </aside>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-3"
        >
          {items.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="overflow-hidden rounded-xl border border-b border-border bg-card px-1 shadow-sm data-[state=open]:border-accent/40 data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="px-5 py-4 font-display text-base font-semibold hover:no-underline [&[data-state=open]>svg]:text-accent [&>svg]:text-accent">
                <span className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  {f.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pl-[3.25rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageSection>
  );
}
