# Panas World Cup 2026 ⚽

App de quiniela del Mundial para desplegar en Vercel + Supabase (ambos gratis).

---

## Paso 1 — Crear la base de datos en Supabase

1. Ve a **[supabase.com](https://supabase.com)** y crea una cuenta gratuita
2. Pulsa **"New project"**, elige un nombre (ej: `panas-wc`) y una contraseña (guárdala)
3. Espera ~1 minuto a que se cree el proyecto
4. En el menú lateral ve a **SQL Editor → New query**
5. Copia y pega todo el contenido del archivo **`supabase_schema.sql`** y pulsa **Run**
6. Ve a **Settings → API** y copia:
   - `Project URL` (algo como `https://xxxxxx.supabase.co`)
   - `anon / public` key (el token largo)

---

## Paso 2 — Subir el código a GitHub

1. Ve a **[github.com](https://github.com)**, crea una cuenta si no tienes
2. Pulsa **"New repository"**, llámalo `panas-wc`, márcalo como **Private**, pulsa **Create**
3. En tu ordenador, abre una terminal en la carpeta `panas-wc` y ejecuta:

```bash
git init
git add .
git commit -m "Panas World Cup inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/panas-wc.git
git push -u origin main
```

---

## Paso 3 — Desplegar en Vercel

1. Ve a **[vercel.com](https://vercel.com)** y crea una cuenta (puedes entrar con GitHub)
2. Pulsa **"Add New Project"** → importa el repositorio `panas-wc`
3. Antes de pulsar Deploy, ve a **"Environment Variables"** y añade:
   - `VITE_SUPABASE_URL` → la URL de tu proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY` → la clave anon de Supabase
4. Pulsa **Deploy** — en ~1 minuto tendrás una URL tipo `panas-wc.vercel.app`

¡Listo! Comparte esa URL con tus amigos y que empiece el juego.

---

## Cómo actualizar la app

Cuando hagas cambios en el código:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel se actualiza automáticamente en ~30 segundos.

---

## Contraseña de admin

La contraseña de admin está en `src/App.jsx`, línea:
```js
const ADMIN_PASS = 'panas2026'
```
Cámbiala antes de subir si quieres.

---

## Estructura del proyecto

```
panas-wc/
├── src/
│   ├── main.jsx          # Entrada React
│   ├── App.jsx           # Componente principal
│   ├── matches.js        # Los 104 partidos del Mundial
│   ├── bracket.js        # Lógica de clasificación y cuadro eliminatorio
│   ├── scoring.js        # Cálculo de puntos
│   ├── db.js             # Operaciones con Supabase
│   ├── supabase.js       # Cliente Supabase
│   └── styles.css        # Estilos
├── supabase_schema.sql   # Schema de base de datos
├── index.html
├── vite.config.js
└── package.json
```
