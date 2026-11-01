import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/40 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-7 sm:right-7"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="hidden pr-1 text-sm font-semibold sm:group-hover:inline">WhatsApp</span>
    </a>
  );
}
