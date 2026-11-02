import type { Metadata } from "next";
import { site } from "@/config/site";
import { getContact } from "@/lib/data";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";
import { ButtonLink, PageHero, Pending, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta a Tritotal Team por WhatsApp para conocer nuestros planes de entrenamiento.",
};

export const revalidate = 300;

export default async function ContactoPage() {
  const { instagram, email } = await getContact();
  return (
    <>
      <PageHero eyebrow="Contacto" title={<>Hablemos de tu <span className="text-sport">próxima meta</span></>} intro="La forma más rápida de comunicarte con nosotros es por WhatsApp." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-sm bg-[#25D366] p-8 text-ink lg:col-span-2">
            <WhatsAppIcon className="h-12 w-12" />
            <p className="mt-6 font-display text-sm font-bold uppercase tracking-widest">WhatsApp oficial</p>
            <p className="font-display text-4xl font-extrabold sm:text-6xl">{site.whatsapp.display}</p>
            <p className="mt-3 max-w-lg">Escríbenos y te contamos sobre entrenamientos, planes e inscripción.</p>
            <div className="mt-8">
              <ButtonLink href={whatsappLink()} external variant="dark">Abrir WhatsApp</ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-sm border border-white/10 bg-petrol-950 p-6">
              <p className="font-display text-sm font-bold uppercase tracking-widest text-sport">Instagram</p>
              {instagram ? (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="mt-2 block text-lg hover:text-sport">{instagram.replace(/^https?:\/\/(www\.)?/, "")}</a>
              ) : (
                <div className="mt-3"><Pending label="Por confirmar" hint="Se completa en el panel → Textos del sitio" /></div>
              )}
            </div>
            <div className="rounded-sm border border-white/10 bg-petrol-950 p-6">
              <p className="font-display text-sm font-bold uppercase tracking-widest text-sport">Correo</p>
              {email ? (
                <a href={`mailto:${email}`} className="mt-2 block text-lg hover:text-sport">{email}</a>
              ) : (
                <div className="mt-3"><Pending label="Por confirmar" hint="Se completa en el panel → Textos del sitio" /></div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
