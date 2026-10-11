import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const variantClass = {
  default: "page-section page-section--default",
  muted: "page-section page-section--muted",
  dark: "page-section page-section--dark",
  contrast: "page-section page-section--contrast",
} as const;

export type PageSectionVariant = keyof typeof variantClass;

type PageSectionProps = {
  id?: string;
  variant?: PageSectionVariant;
  children: ReactNode;
  className?: string;
  /** Si es false, no envuelve en page-width (p. ej. hero). */
  contained?: boolean;
};

export function PageSection({
  id,
  variant = "default",
  children,
  className,
  contained = true,
}: PageSectionProps) {
  return (
    <section id={id} className={cn(variantClass[variant], "scroll-mt-28", className)}>
      {contained ? <div className="page-width">{children}</div> : children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div className="section-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-lead">{description}</p> : null}
      </div>
      {action ? <div className="section-head-action shrink-0">{action}</div> : null}
    </div>
  );
}
