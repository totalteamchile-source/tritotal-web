# Tritotal Team – Sitio web oficial

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4.

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # versión de producción
```

## Dónde se edita el contenido

| Qué | Archivo |
|---|---|
| WhatsApp, Instagram, correo, logos | `src/config/site.ts` |
| Historia, misión, visión, valores, entrenadores | `src/content/about.ts` |
| Disciplinas y preparación específica | `src/content/trainings.ts` |
| Planes y precios | `src/content/plans.ts` |
| Horarios, competencias y resultados | `src/content/events.ts` |
| Fotos, videos y noticias | `src/content/gallery.ts` (fotos en `public/fotos/`) |
| Términos / datos personales | `src/app/terminos`, `src/app/privacidad` |

Todo campo en `null` o lista vacía se muestra en el sitio como **"pendiente"**; no se inventa información.

### Logotipos
1. Copiar las versiones blancas (PNG/SVG transparente) a `public/brand/`.
2. En `src/config/site.ts → logos`, indicar `src`, `width` y `height` reales del archivo. El componente respeta la proporción original.

### Dominio
Definir `NEXT_PUBLIC_SITE_URL` (ej. en Vercel) para SEO, sitemap y Open Graph.

## Identidad visual
- Fondo: negro `#05090b` y azul petróleo `#061519` → `#16444f`
- Acento: turquesa / celeste `#2ccfdc`
- Tipografías: Barlow Condensed (títulos) y Barlow (texto)
- Tokens en `src/app/globals.css`

## Inscripciones (Etapa 3)

El formulario `/inscripcion` valida los datos en el navegador y en el servidor (`src/lib/registration.ts`)
y los envía a `POST /api/inscripciones`, que:

1. Guarda la inscripción en Supabase (tabla `inscripciones`) con un folio (ej. `TT-7K3QX9`).
2. Avisa por correo al administrador (`ADMIN_EMAIL`) y envía la confirmación al deportista (opcional, vía Resend).
3. Muestra el folio en pantalla y ofrece continuar por WhatsApp.

Mientras Supabase no esté configurado, el formulario sigue funcionando: muestra la confirmación y deriva
la solicitud a WhatsApp, sin decir que se guardó.

### Configurar Supabase
1. Crear un proyecto en https://supabase.com (región São Paulo recomendada para Chile).
2. En **SQL Editor**, ejecutar `supabase/migrations/0001_inscripciones.sql`.
3. En **Project Settings → API**, copiar la URL y la clave `service_role` a `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (ver `.env.example`).
4. Las inscripciones se ven en **Table Editor → inscripciones** hasta que esté listo el panel (Etapa 5).

La tabla tiene RLS activado y sin políticas públicas: solo el servidor puede leer y escribir.

### Correos (opcional)
Crear cuenta en https://resend.com, verificar el dominio y completar `RESEND_API_KEY`, `MAIL_FROM` y `ADMIN_EMAIL`.
Sin esto, las inscripciones se guardan igual pero no se envían correos.

## Etapas
- [x] Etapa 1 – Diseño: identidad, portada, menú, versión móvil
- [x] Etapa 2 – Páginas: Inicio, Nosotros, Entrenamientos, Planes, Competencias/Resultados, Galería, Contacto
- [x] Etapa 3 – Inscripciones: formulario, registro en Supabase, folio de confirmación, aviso al administrador por correo y WhatsApp
- [ ] Etapa 4 – Pagos (Webpay / Mercado Pago) y mensualidades
- [ ] Etapa 5 – Panel de administración
- [ ] Etapa 6 – Pruebas y publicación
