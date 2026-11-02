import { site } from "@/config/site";

/** Enlace wa.me con mensaje precargado. */
export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Enlace wa.me hacia un número chileno cualquiera (ej. un deportista). */
export function whatsappLinkTo(phone: string, message: string) {
  let n = phone.replace(/\D/g, "");
  if (n.length === 9 && n.startsWith("9")) n = "56" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}
