import { site } from "@/config/site";

/** Enlace wa.me con mensaje precargado. */
export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
