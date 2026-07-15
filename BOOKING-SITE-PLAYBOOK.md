# Playbook: sitio + sistema de reservas para negocios locales

Guía reutilizable basada en la construcción de la demo de Mariel Martínez Estética.
Pensada para replicar el mismo tipo de proyecto (peluquerías, barberías, spas,
consultorios, entrenadores personales, cualquier negocio que atienda por turnos)
sin repartir la parte específica de marca. Lo que sí importa acá es el **stack, la
metodología de diseño, la arquitectura del sistema de reservas y los problemas que
ya pisé** para no volver a pisarlos.

---

## 1. Stack base

```
Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion
Prisma + SQLite (con driver adapter) para persistencia
Componentes propios estilo shadcn (no uso el CLI, los escribo a mano)
```

**Por qué este stack para este tipo de proyecto:**
- Un solo repo sirve de sitio público + API + panel admin. No hace falta backend aparte.
- SQLite alcanza y sobra para un negocio de un local/una profesional. Nada de
  levantar Postgres para 50 reservas por semana.
- Server Components para todo lo que es contenido (servicios, landing) y Route
  Handlers para las mutaciones (reservar, cancelar, reagendar). Simple, sin
  capas de más.

**Cómo arranco el proyecto** (ver §7 para los dolores de cabeza de versiones nuevas):
```bash
npx create-next-app@latest <carpeta-temporal> --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
# mover todo a la carpeta real si el nombre de carpeta tiene mayúsculas/tildes
# (npm no acepta esos caracteres en el nombre del proyecto)
npm install framer-motion prisma @prisma/client zod date-fns lucide-react clsx tailwind-merge class-variance-authority sonner @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-label
```

No instalo `shadcn` vía CLI. Para 10-15 componentes base (Button, Input, Dialog,
Tabs, Badge, Card) sale más rápido y más liviano escribirlos a mano sobre Radix
primitives + `class-variance-authority`, y tengo control total del look.

---

## 2. Metodología de diseño (lo que sí se replica)

### 2.1 Extraer la identidad ANTES de tocar código

Si el cliente tiene Instagram/flyers/capturas: **abrirlas y mirarlas primero**,
antes de escribir una sola línea. De ahí saco:
- Paleta (2-4 colores reales, no inventados)
- Tono tipográfico (¿elegante-serif? ¿bold-moderno? ¿script-femenino?)
- Vocabulario visual (corazones/destellos = femenino-suave; mármol/dorado = lujo;
  bordes gruesos/geométrico = deportivo, etc.)
- Textos reales (lemas, nombres de servicios, precios) — nunca lorem ipsum.

Si las imágenes son capturas de pantalla de Instagram (con la barra de estado del
celular, UI de la app encima), **no las uso como fotos del sitio**. Se ven a
medio cocinar. En cambio:
- Si hay un logo reconocible, lo **recreo en SVG limpio** (ver §2.3).
- Para "fotos" que no tengo, uso texturas/gradientes propios en la paleta de
  marca en vez de fotos de stock genéricas — se ve más premium que un stock
  photo mal elegido, y no genera expectativas falsas.

### 2.2 Sistema de theme con Tailwind v4

Tailwind v4 ya no usa `tailwind.config.js` — el theme se define en CSS con
`@theme`. El patrón que reuso:

```css
/* globals.css */
@import "tailwindcss";
@import "tw-animate-css"; /* utilidades animate-in/animate-out para modales */

:root {
  /* paleta cruda, en escalas de 50-900 por color semántico de marca */
  --color-brand-50: #...;
  --color-brand-500: #...;
  /* ... */
  --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
}

@theme inline {
  --color-brand-50: var(--color-brand-50);
  /* repetir cada token: esto es lo que genera las clases bg-brand-50, etc. */
  --font-display: var(--font-playfair); /* o lo que corresponda al rubro */
  --font-sans: var(--font-body);
}
```

Regla práctica: **3 familias tipográficas, no más**:
1. Display/serif para títulos (elegancia) — o un grotesk bold si el rubro es
   deportivo/tech.
2. Una tipografía de acento (script, o una condensada) para 1-2 detalles, nunca
   para texto largo.
3. Una sans limpia para todo el cuerpo. Evitar Inter/Roboto/Arial si el cliente
   quiere sentirse "premium" — quedan genéricas. Poppins, Manrope, Plus Jakarta
   Sans son alternativas seguras.

### 2.3 Logo: mark + wordmark, nunca solo texto

Patrón reutilizable — tres variantes del mismo logo como componentes:
- `LogoMark`: solo el ícono/símbolo (SVG, para favicon, nav mobile, loading states)
- `Logo`: mark + nombre en tipografía de acento + tagline chico en mayúsculas
  con tracking (para navbar)
- `LogoBadge`: versión circular completa tipo sello (para hero, footer)

Si no hay un logo vectorial disponible, lo reconstruyo en SVG simple (formas
geométricas básicas: pétalos, círculos, líneas) en vez de arriesgarme a un ícono
figurativo complejo sin poder previsualizarlo — un símbolo abstracto bien
ejecutado gana siempre a una silueta mal lograda.

### 2.4 Evitar que se vea "genérico de IA"

Instalé y usé como referencia dos skills de diseño (`emilkowalski/skill` y
`Leonxlnx/taste-skill` vía `npx skills add <repo>`) que dejan una checklist
concreta. Los puntos que más cambian el resultado:

- **Nunca** `scale(0)` de entrada — arrancar en `scale(0.95)` + opacity.
- **Nunca** `ease-in` en UI — usar `ease-out` o curvas custom
  (`cubic-bezier(0.23, 1, 0.32, 1)`), `ease-in` se siente lento.
- Animaciones de UI (dropdowns, botones) menor a 300ms. Modales 200-500ms.
  Marketing/scroll-reveal puede ser más largo (600-800ms).
- Solo animar `transform` y `opacity` (GPU), nunca `width`/`height`/`top`/`left`.
- Stagger de 30-80ms entre ítems de una lista, nunca más — si no, se siente lento.
- Botones con `active:scale-[0.97]` — feedback de "escuchó el click".
- Popovers escalan desde el trigger (`transform-origin`), modales desde el centro.
- Espaciado generoso: `py-24` a `py-40` en secciones, no tener miedo al
  whitespace — es lo que más separa "se ve caro" de "se ve plantilla".
- Eyebrow tags (pastillita chica en mayúsculas con tracking ancho) antes de cada
  H2 — barato de hacer, sube mucho la percepción de cuidado editorial.

### 2.5 Estructura de landing (formula reutilizable)

Para un negocio local de servicios por turno, esta secuencia de secciones
funciona casi siempre:

```
Hero (propuesta + CTA "Reservar" + prueba social chica)
Servicios (cards filtrables por categoría, precio y duración visibles)
Beneficios ("por qué elegirnos", 4 bullets con ícono)
Galería (fotos reales si hay, si no texturas de marca)
Promo destacada + upsell (combo, gift card, lo que aplique)
Ubicación (mapa embebido + horario + contacto)
Testimonios (3 tarjetas, nombres y servicios específicos, no genéricos)
Footer (contacto, redes, dirección, links a "Mis turnos" / admin)
```

Navbar flotante tipo "pill" separada del borde (`mt-4`, `rounded-full`,
`backdrop-blur`) en vez de pegada arriba — lee más moderno que una navbar clásica
full-width.

---

## 3. Arquitectura del sistema de reservas (la parte que más se reutiliza)

Este es el núcleo que sirve para *cualquier* negocio que atiende por turno, no
solo estética. Cambia el nombre de las entidades, no la forma.

### 3.1 Modelo de datos

```prisma
model Service {
  id, slug, name, category, description, durationMin, price, priceLabel
  // durationMin es la clave: cada servicio "ocupa" un bloque distinto de agenda
}

model Booking {
  id, code (código público único tipo "MM-7F3K2")
  serviceId, date (DateTime = inicio), durationMin (copiado del service al reservar)
  clientName, clientPhone, clientEmail?, note?
  status: "confirmed" | "cancelled" | "rescheduled" | "completed"
}

model Notification {
  bookingId?, type, title, message, clientName, read
  // feed de eventos para el panel del dueño — ver §3.4
}

model AvailabilityRule { weekday, startTime, endTime, active }
model BlockedDate { date, reason? }
```

Puntos que importan:
- `durationMin` se copia al `Booking` en el momento de reservar (no se lee del
  `Service` después) — si el dueño cambia la duración de un servicio a futuro,
  no rompe las reservas ya hechas.
- `code` autogenerado (5 caracteres, alfabeto sin 0/O/1/I para evitar
  confusión al leerlo por teléfono) — es lo que la clienta usa para
  autogestionar su turno sin necesitar login.
- Sin login de verdad para el cliente. Autogestión por **teléfono o código**.
  Para este tamaño de negocio, un login con contraseña es fricción que sobra.

### 3.2 Algoritmo de disponibilidad

La función central (reutilizable tal cual, cambia solo `BUSINESS_HOURS`):

```
getAvailableSlots({ day, durationMin, existingBookings, isBlocked, now, minLeadMin }):
  si está bloqueado el día → []
  buscar horario de atención de ese día de la semana → si no atiende → []
  generar candidatos cada SLOT_STEP_MIN (30 min típico) desde apertura a cierre
  para cada candidato:
    descartar si candidato + durationMin > hora de cierre
    descartar si candidato < ahora + minLeadMin (no dejar reservar "ya mismo")
    descartar si se superpone con alguna reserva existente activa
  devolver los que sobreviven, como "HH:mm"
```

`minLeadMin` (tiempo mínimo de anticipación, uso 60 min) evita que alguien
reserve un turno para dentro de 5 minutos cuando el dueño no llega a verlo.

**Anti doble-reserva:** la creación del turno vuelve a chequear superposición
*dentro de una transacción* de base de datos, no solo confía en lo que el
frontend mostró como libre — dos personas pueden estar mirando el mismo horario
libre al mismo tiempo, gana la que efectivamente hace el POST primero, la
segunda recibe 409 y se le pide elegir otro horario.

### 3.3 Wizard de reserva (patrón de componente)

5 pasos, cada uno bloquea el "Continuar" hasta tener lo mínimo:
```
1. Servicio (cards con precio/duración)
2. Profesional (si hay una sola, paso de confirmación igual — genera confianza)
3. Fecha + hora (chips de día horizontal-scroll + grilla de horarios que se
   recalcula con fetch al elegir el día)
4. Datos (nombre, teléfono validado con regex local, email opcional, nota)
5. Confirmación (código grande, resumen, botón "agregar al calendario" con
   archivo .ics generado en el cliente, sin backend)
```

Indicador de pasos arriba (círculos numerados + línea que se llena), transición
entre pasos con fade+slide horizontal corto (250-300ms). El wizard vive en un
solo componente cliente con `useState` para el paso — no hace falta librería de
formularios para 4 campos.

### 3.4 Panel del dueño

Estructura que reuso siempre:
```
Login simple (una clave, cookie httpOnly — no es multiusuario, no hace falta más)
Dashboard: 4 stat cards (turnos hoy, próximos, cancelaciones, ingreso estimado semana)
Tabs: Agenda semanal | Listado con filtro por estado | Notificaciones | Disponibilidad
```

**Notificaciones simuladas, no reales, para la demo de venta:** el punto de
venta es mostrarle al dueño *exactamente* cómo se va a ver el aviso de
WhatsApp que recibiría, sin todavía integrar la API real (eso es India, plata y
tiempo aparte). Patrón:
- Cada evento (nueva reserva / cancelación / reagendado) crea una `Notification`
  en la base con el texto ya formateado como se vería el mensaje real.
- El panel hace **polling cada 3-4 segundos** a `/api/admin/notifications` y
  dispara un toast + una tarjeta con estética de burbuja de WhatsApp por cada
  notificación nueva. No hace falta websockets para este volumen.
- En el punto exacto donde iría el envío real, dejo un comentario:
  `// TODO: conectar API WhatsApp/Twilio/Email`
  Esto es un argumento de venta en sí mismo: le podés mostrar al cliente que la
  demo "ya está lista" para conectar la mensajería real, es un paso después, no
  un rediseño.

### 3.5 Autogestión de turnos (`/mis-turnos`)

Buscar por teléfono o código → lista de turnos → cancelar (con diálogo de
confirmación, libera el horario al toque) o reagendar (reabre el mismo selector
de fecha/hora del wizard, dentro de un modal). Nada de esto requiere cuenta de
usuario.

---

## 4. Sistema de diseño de componentes (reutilizable como carpeta base)

```
src/components/ui/          → primitives: button, input, dialog, tabs, badge, card
src/components/site/        → navbar, hero, secciones de landing, logo, footer
src/components/booking/     → wizard + cada step
src/components/mis-turnos/  → booking-card, cancel-dialog, reschedule-dialog
src/components/admin/       → dashboard, agenda, stats, notifications-feed
src/components/shared/      → cosas que cruzan (status-badge, etc.)
src/lib/                    → prisma client, availability, timezone, format, constants
```

Esta carpeta `src/components/ui` con Button/Input/Dialog/Tabs/Badge/Card
escritos sobre Radix + CVA es literalmente copiable entre proyectos — lo único
que cambia entre clientes son los tokens de color que consume vía `cn()`.

---

## 5. Cosas que se me escaparon y ya no se repiten

### 5.1 Zona horaria — el bug que más dolió

**Nunca usar `Date` con métodos locales (`getHours`, `setHours`, `startOfDay`,
`getDay` de date-fns, etc.) en código que corre en un servidor**, porque el
servidor de producción casi seguro corre en UTC, y en desarrollo tu máquina
tiene la zona horaria del cliente/tuya propia — **todo funciona perfecto en
local y se rompe en producción**, y el síntoma es un corrimiento de horas fijo
(3hs para Uruguay/Argentina/Chile continental, revisar el offset del país del
cliente).

Solución que reuso: un módulo `timezone.ts` con el offset fijo del país
(si el país no tiene horario de verano — Uruguay lo abolió en 2015 — un offset
constante alcanza, no hace falta una librería de zonas horarias completa):

```ts
const OFFSET = "-03:00"; // ajustar por país
const OFFSET_MS = 3 * 60 * 60 * 1000;

// construir un instante real a partir de fecha+hora "de pared" del negocio
export function localDateTime(dateStr: string, time = "00:00"): Date {
  return new Date(`${dateStr}T${time}:00${OFFSET}`);
}

// leer los campos de un instante como si el reloj fuera el del negocio,
// sin importar en qué zona horaria corre el proceso que lo ejecuta
export function toLocalFields(instant: Date): Date {
  return new Date(instant.getTime() - OFFSET_MS);
}
```

Regla de oro: **construir siempre con offset explícito, leer siempre con
`getUTC*()` sobre el resultado de `toLocalFields`, nunca con `getHours()`/
`getDay()` a secas.** Para mostrar fechas al usuario, fijar `timeZone` explícito
en cada `Intl.DateTimeFormat` — no confiar en el default ambiente (que en el
navegador coincide con el usuario, pero en cualquier render de servidor no).

**Cómo probarlo sin esperar a deployar:** Node respeta la variable de entorno
`TZ`. Antes de dar por cerrado cualquier feature con fechas, correr:
```bash
TZ=UTC npm run dev
```
y repetir el flujo completo. Si algo se corre de hora ahí, se va a correr en
producción.

### 5.2 Prisma con versiones nuevas (v7+)

- El generator moderno (`provider = "prisma-client"`) ya **no** exporta los
  tipos de modelo "pelados" (`Service`, `Booking`) desde `models.ts` — ahí
  están como `ServiceModel`, `BookingModel`. Los nombres cortos sin sufijo
  viven en el **`client.ts`** que genera (`import type { Service } from
  ".../generated/prisma/client"`), no en `models.ts`.
- El cliente en runtime ahora **exige un driver adapter explícito** incluso
  para SQLite — ya no alcanza con poner la URL en el schema. Para SQLite en
  Node, uso `@prisma/adapter-libsql` + `@libsql/client` (evita compilar
  binarios nativos tipo `better-sqlite3`, que en Windows sin build tools
  instalados falla).
- `prisma db push` en v7 no acepta más `--skip-generate` como flag (revisar
  `prisma db push --help` en cada versión nueva, cambia).
- La configuración de datasource se movió a `prisma.config.ts` (no más
  `url = env(...)` inline en el `schema.prisma` para todo — el schema define
  el shape, el config define cómo conectar el CLI).

### 5.3 Next.js con versiones nuevas (v16+)

- `params` y `searchParams` en páginas y route handlers son **Promise**, hay
  que `await`-earlos. Si el modelo con el que estás generando código es
  anterior a esta versión, va a escribir la sintaxis vieja síncrona — el
  propio `node_modules/next/dist/docs/` trae la documentación embebida de esa
  versión exacta, conviene leerla antes de escribir rutas dinámicas si hay
  dudas de qué cambió.
- Turbopack (el bundler nuevo por defecto) tuvo un bug con `next/font/google`
  en este entorno concreto — si aparece `Module not found:
  .../internal/font/google/font`, probar `next dev --webpack` /
  `next build --webpack` como mitigación inmediata.
- Una página que hace `prisma.algo.findMany()` directo en un Server Component
  **se prerenderiza en build time** por defecto si no tiene nada dinámico
  (cookies, searchParams, etc.) — en Railway/Vercel con volumen montado solo
  en runtime, esto rompe el build porque la base no existe todavía durante el
  build. Si la página lee de la base, forzar:
  ```ts
  export const dynamic = "force-dynamic";
  ```

### 5.4 Deploy a Railway con SQLite

- **`railway run <comando>` corre en tu máquina local** con las variables de
  entorno de Railway inyectadas — **no** ejecuta dentro del contenedor. Para
  algo como `prisma db push` contra un volumen persistente, esto no sirve: el
  comando toca un archivo local, no el volumen real. La única forma confiable
  de tocar el volumen real es hacer que el propio contenedor lo haga al
  arrancar.
- Patrón que uso: un script `prisma/release.ts` que corre **antes** del
  `next start` (en el `start` script de `package.json`):
  ```json
  "start": "tsx prisma/release.ts && next start"
  ```
  Ese script hace `prisma db push` (idempotente, seguro correr en cada arranque)
  y siembra datos de ejemplo **solo si la tabla está vacía** — así un redeploy
  nunca borra reservas reales ya cargadas por un cliente. Dejo un escape hatch
  por variable de entorno (`FORCE_RESEED=true`) para poder resetear a mano una
  sola vez si hace falta, con advertencia de sacarla después.
- Volumen persistente obligatorio — sin él, cada redeploy empieza con la base
  vacía. `DATABASE_URL=file:/data/prod.db` apuntando al path del volumen
  montado.
- Railway/Railpack instala con `npm ci` (estricto: falla si el lockfile no
  está 100% sincronizado) y además hace `--omit=dev` en producción — **las
  devDependencies no están disponibles en runtime**. Cualquier herramienta que
  el `start` script necesite en producción (en este caso `tsx`, `dotenv`) tiene
  que estar en `dependencies`, no en `devDependencies`.
- Si el lockfile generado en Windows/Mac migra a un build Linux y aparecen
  errores de "Missing: paquete@versión from lock file" para paquetes con
  binarios nativos por plataforma (`@emnapi/*`, `@napi-rs/*`, etc.), es
  resolución no determinística de dependencias opcionales — la salida más
  robusta es setear la variable `RAILPACK_INSTALL_CMD=npm install` (en vez de
  `npm ci`) para que el builder tolere pequeñas diferencias en vez de fallar
  duro.
- Revisar `engines.node` en `package.json` contra los requisitos de **todas**
  las dependencias (incluidas las opcionales transitivas) — si una pide una
  versión de Node más nueva que la mínima declarada, el builder puede elegir
  una versión de Node que no la satisface y generar warnings/inestabilidad.

---

## 6. Checklist de QA antes de entregar una demo

- [ ] Correr el flujo completo real (no solo mirar el diseño): reservar →
      verlo aparecer en notificaciones del admin → cancelar → confirmar que el
      horario se liberó.
- [ ] Probar con `TZ=UTC` localmente si el deploy final va a un servidor en UTC.
- [ ] `npm run build` de producción tiene que pasar limpio (compila + tipa)
      antes de dar por terminado — el dev server es más permisivo y esconde
      errores que solo aparecen en build.
- [ ] Mobile real: capturas en ~390px de las pantallas clave (landing, wizard,
      panel admin), no asumir que "responsive" quedó bien porque el CSS usa
      breakpoints.
- [ ] Para animaciones "reveal on scroll": si se prueban con una herramienta
      que saca un screenshot de la página completa sin scrollear de verdad
      (Playwright `fullPage` sin mover el viewport), pueden aparecer secciones
      en blanco — no es un bug real, es que el `IntersectionObserver` nunca
      disparó. Verificar scrolleando de verdad antes de reportar un bug.
- [ ] Revisar que no haya placeholders visibles (`lorem ipsum`, "servicio de
      ejemplo") — todo texto tiene que ser del negocio real.

---

## 7. Qué cambia y qué no cambia entre clientes

**Se reescribe entero por cliente:**
paleta de colores, tipografías, copy, logo, textos de servicios/precios,
testimonios, fotos/galería, dirección/mapa, WhatsApp.

**Se reutiliza prácticamente intacto:**
todo `src/components/ui/`, el modelo de datos de reservas (§3.1), el algoritmo
de disponibilidad (§3.2), el wizard de reserva como estructura (§3.3), el panel
admin como estructura (§3.4), el sistema de notificaciones simuladas (§3.4), el
módulo de timezone (§5.1), el patrón de release script para Railway (§5.4), y
toda esta lista de gotchas.

Para el próximo cliente: copiar el proyecto entero, correr por §2.1 (mirar sus
redes/flyers), reescribir tokens de Tailwind + fuentes + logo, reescribir el
seed con sus servicios reales, y el 80% del trabajo pesado (reservas, admin,
notificaciones, deploy) ya está resuelto.
