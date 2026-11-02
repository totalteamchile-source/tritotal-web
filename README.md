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
Dominio oficial: **https://www.tritotalteam.cl** (registrado en NIC Chile con DNS `ns1/ns2.vercel-dns.com`; `tritotalteam.cl` redirige a `www`). Se puede sobrescribir con `NEXT_PUBLIC_SITE_URL`.

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

## Panel de administración (Etapa 5)

Ruta privada `/admin`. Inicio de sesión con Supabase Auth (correo y contraseña).

| Rol | Puede |
|---|---|
| **admin** | Todo: inscripciones, deportistas, planes y precios, horarios, competencias, resultados, entrenadores, fotos, videos, noticias, valores, textos del sitio y usuarios del panel |
| **entrenador** | Deportistas, horarios, competencias, resultados, fotos, videos y noticias |

Lo que se edita en el panel se publica al instante en el sitio. Si una tabla no existe o Supabase no está
configurado, el sitio usa como respaldo los archivos de `src/content`.

### Activarlo
1. Ejecutar `supabase/migrations/0002_panel.sql` en **SQL Editor** (después de `0001`).
2. Agregar en Vercel la variable `SUPABASE_ANON_KEY` (Supabase → Project Settings → API → clave `anon public`) y hacer **Redeploy**.
3. En Supabase → **Authentication → Users → Add user**, crear el usuario con el correo de `ADMIN_EMAIL`, marcando **Auto Confirm User**. Al ingresar por primera vez recibe rol admin automáticamente.
4. En Supabase → **Authentication → Sign In / Providers**, desactivar **Allow new users to sign up** (los usuarios se crean solo desde el panel).
5. Ingresar en `/admin/login`. Los entrenadores se agregan desde **Usuarios del panel**.

Las imágenes se suben al bucket público `medios` de Supabase Storage (máx. 4 MB por imagen).

## Tienda (Etapa 4)

`/tienda` muestra los productos activos; cada uno tiene tallas con stock. El carrito se guarda en el navegador.
Al pagar, `POST /api/pedidos` vuelve a calcular precios y stock **desde la base de datos**, crea el pedido
y redirige a **Mercado Pago Checkout Pro**. El sitio nunca recibe datos de tarjetas.

- Aviso de pago: `POST /api/pagos/mercadopago` (webhook). El pago se consulta a la API de Mercado Pago antes de
  marcar el pedido como pagado; se valida el monto y el stock se descuenta una sola vez.
- Al volver de Mercado Pago, `/tienda/pedido/[id]` también consulta el pago por si el aviso aún no llegó.
- Sin `MERCADOPAGO_ACCESS_TOKEN`, los pedidos se registran igual y el pago se coordina por WhatsApp.

### Activar Mercado Pago
1. Ejecutar `supabase/migrations/0003_tienda.sql` en Supabase.
2. En https://www.mercadopago.cl/developers/panel crear una aplicación (Checkout Pro) y copiar el
   **Access Token de producción** a `MERCADOPAGO_ACCESS_TOKEN` en Vercel.
3. En la aplicación → **Webhooks**: URL `https://www.tritotalteam.cl/api/pagos/mercadopago`, evento **Pagos**.
   Copiar la clave secreta a `MERCADOPAGO_WEBHOOK_SECRET`. Hacer **Redeploy**.

## Nuestros deportistas

Página `/deportistas`. Se muestra un deportista cuando en el panel se marca **«Mostrar en Nuestros deportistas»**
(requiere su autorización). Solo se publican foto, nombre, especialidad y logros; nunca datos de contacto.
Requiere `supabase/migrations/0004_deportistas_publicos.sql`.

La frase y el subtítulo de la portada se editan en el panel → **Textos del sitio**.

## Etapas
- [x] Etapa 1 – Diseño: identidad, portada, menú, versión móvil
- [x] Etapa 2 – Páginas: Inicio, Nosotros, Entrenamientos, Planes, Competencias/Resultados, Galería, Contacto
- [x] Etapa 3 – Inscripciones: formulario, registro en Supabase, folio de confirmación, aviso al administrador por correo y WhatsApp
- [x] Etapa 4a – Tienda con carrito y pago con Mercado Pago
- [ ] Etapa 4b – Cobro de mensualidades e historial de pagos de deportistas
- [x] Etapa 5 – Panel de administración (pagos se integran en la Etapa 4)
- [ ] Etapa 6 – Pruebas y publicación

## Calendario de competencias

Página `/competencias`. Trae cargado el calendario de triatlón en Chile tomado de
[trichile.cl/calendario_nacional](https://www.trichile.cl/calendario_nacional) (consultado el 2 de noviembre de 2026),
con fecha, lugar, distancias y enlace oficial de cada carrera. Las carreras pasadas se mueven solas a «Competencias anteriores».
Con la base de datos activa se edita en el panel → **Competencias** (campos «Fecha de término» y «Enlace oficial»).
Requiere `supabase/migrations/0005_calendario_competencias.sql`, que agrega esos campos y carga el calendario sin duplicar.
