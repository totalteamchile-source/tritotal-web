/**
 * Planes y membresías. Los precios están PENDIENTES de confirmación:
 * mientras `price` sea null, la ficha muestra "Precio por confirmar".
 * En la Etapa 4 estos datos se moverán a la base de datos (Supabase)
 * y se administrarán desde el panel.
 */
export type Billing = "mensual" | "trimestral" | "otro";

export type Plan = {
  id: string;
  name: string;
  description: string;
  disciplines: string[];
  frequency: string | null;
  benefits: string[];
  price: number | null; // CLP
  billing: Billing;
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    id: "plan-1",
    name: "Plan por definir 1",
    description: "Descripción pendiente. Editar en src/content/plans.ts.",
    disciplines: ["Natación", "Ciclismo", "Running"],
    frequency: null,
    benefits: [],
    price: null,
    billing: "mensual",
  },
  {
    id: "plan-2",
    name: "Plan por definir 2",
    description: "Descripción pendiente. Editar en src/content/plans.ts.",
    disciplines: ["Natación", "Ciclismo", "Running"],
    frequency: null,
    benefits: [],
    price: null,
    billing: "mensual",
    highlighted: true,
  },
  {
    id: "plan-3",
    name: "Plan por definir 3",
    description: "Descripción pendiente. Editar en src/content/plans.ts.",
    disciplines: ["Natación", "Ciclismo", "Running"],
    frequency: null,
    benefits: [],
    price: null,
    billing: "trimestral",
  },
];

export function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export const billingLabel: Record<Billing, string> = {
  mensual: "Mensual",
  trimestral: "Trimestral",
  otro: "Otra modalidad",
};
