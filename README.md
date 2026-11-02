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

## Etapas
- [x] Etapa 1 – Diseño: identidad, portada, menú, versión móvil
- [x] Etapa 2 – Páginas: Inicio, Nosotros, Entrenamientos, Planes, Competencias/Resultados, Galería, Contacto
- [~] Etapa 3 – Inscripciones: formulario con validación y confirmación por WhatsApp listo; falta base de datos (Supabase) y aviso al administrador
- [ ] Etapa 4 – Pagos (Webpay / Mercado Pago) y mensualidades
- [ ] Etapa 5 – Panel de administración
- [ ] Etapa 6 – Pruebas y publicación
