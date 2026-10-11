import {
  Bath,
  Droplets,
  Flame,
  Gauge,
  ShowerHead,
  Waves,
  type LucideIcon,
} from "lucide-react";

export const FONTANERIA_SERVICE_NAMES = [
  "Urgencia / fuga de agua",
  "Atasco en fregadero o WC",
  "Calentador o termo",
  "Grifería y cisternas",
  "Reforma de baño",
  "Desagües e instalaciones",
  "Presión de agua / bomba",
  "Otro (fontanería)",
] as const;

export type FontaneriaService = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: string[];
  image: string;
};

export const FONTANERIA_SERVICES: FontaneriaService[] = [
  {
    id: "urgencias",
    title: "Urgencias 24 h",
    description: "Fugas, roturas y averías que no pueden esperar.",
    icon: Droplets,
    points: ["Corte de agua y contención", "Reparación in situ", "Presupuesto antes de actuar"],
    image: "/assets/galeria/tuberias-pvc.png",
  },
  {
    id: "atascos",
    title: "Atascos y desagües",
    description: "Fregaderos, WC, bajantes y arquetas.",
    icon: Waves,
    points: ["Desatascos mecánicos", "Limpieza de bajantes", "Detección de obstrucciones"],
    image: "/assets/galeria/desague-instalacion.png",
  },
  {
    id: "calentadores",
    title: "Calentadores y termos",
    description: "Instalación, revisión y sustitución.",
    icon: Flame,
    points: ["Termos eléctricos", "Calentadores a gas", "Mantenimiento y averías"],
    image: "/assets/galeria/contador-agua.png",
  },
  {
    id: "banos",
    title: "Baños y duchas",
    description: "Reformas completas o cambio de equipos.",
    icon: Bath,
    points: ["Platos de ducha", "Mamparas y grifería", "Alicatado coordinado"],
    image: "/assets/galeria/hero-bano.png",
  },
  {
    id: "griferia",
    title: "Grifería y sanitarios",
    description: "Sustitución sin obra innecesaria.",
    icon: ShowerHead,
    points: ["Monomandos y mezcladores", "Cisternas empotradas", "Sifones y latiguillos"],
    image: "/assets/galeria/bano-compacto.png",
  },
  {
    id: "presion",
    title: "Presión y bombeo",
    description: "Soluciones para viviendas y locales.",
    icon: Gauge,
    points: ["Grupos de presión", "Instalaciones nuevas", "Ajuste de presión"],
    image: "/assets/galeria/instalacion-bomba.png",
  },
];

export const GALLERY_ITEMS = [
  { src: "/assets/galeria/bano-reforma-moderna.png", alt: "Baño reformado con ducha y alicatado", tag: "Reforma baño" },
  { src: "/assets/galeria/plato-ducha.png", alt: "Instalación de plato de ducha", tag: "Plato de ducha" },
  { src: "/assets/galeria/bano-alicatado.png", alt: "Baño con alicatado y sanitarios", tag: "Alicatado" },
  { src: "/assets/galeria/columna-desague.png", alt: "Instalación de columna de desagüe", tag: "Desagües" },
  { src: "/assets/galeria/obra-fontaneria.png", alt: "Obra de fontanería en vivienda", tag: "Obra nueva" },
  { src: "/assets/galeria/instalacion-bomba.png", alt: "Grupo de presión instalado", tag: "Presión de agua" },
  { src: "/assets/galeria/tuberias-pvc.png", alt: "Tuberías PVC en instalación", tag: "Tuberías" },
  { src: "/assets/galeria/equipo-ayox.png", alt: "Equipo AYOX en obra", tag: "Nuestro equipo" },
] as const;

export const PRICE_BANDS = [
  { label: "Desplazamiento + diagnóstico", hint: "Urgencias y visitas", price: "Desde 45 €" },
  { label: "Desatasco sencillo", hint: "Fregadero o lavabo", price: "Desde 70 €" },
  { label: "Cambio de grifería", hint: "Monomando estándar", price: "Desde 85 €" },
  { label: "Reforma baño completa", hint: "Según m² y materiales", price: "Presupuesto cerrado" },
] as const;
