---
description: Paso a paso para configurar Supabase
---

Sigue estos pasos para configurar tu base de datos en Supabase y conectar la aplicación:

### 1. Crear el Proyecto
1. Ve a [supabase.com](https://supabase.com) e inicia sesión.
2. Haz clic en **"New Project"**.
3. Selecciona tu organización, dale un nombre (ej. `TripCountdown`) y una contraseña segura para la base de datos.
4. Selecciona la región más cercana a ti y haz clic en **"Create new project"**.

### 2. Crear la Tabla `trips`
Una vez creado el proyecto, necesitamos crear la tabla donde se guardarán tus viajes:

1. En el menú lateral izquierdo, haz clic en **"SQL Editor"**.
2. Haz clic en **"New query"**.
3. Pega el siguiente código SQL y haz clic en **"Run"**:

```sql
-- Crear la tabla de viajes
create table trips (
  id uuid default gen_random_uuid() primary key,
  destination text not null,
  target_date timestamptz not null,
  itinerary jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Habilitar Row Level Security (RLS)
alter table trips enable row level security;

-- Crear una política para permitir que cualquiera lea y escriba
-- (Ideal para un demo rápido, en producción usarías autenticación)
create policy "Permitir todo a todos"
on trips for all
using (true)
with check (true);
```

### 3. Obtener las LLaves de API
Para que tu App hable con Supabase, necesitas las credenciales:

1. Ve a **"Project Settings"** (el icono de engranaje abajo a la izquierda).
2. Haz clic en **"API"**.
3. Copia la **Project URL** y la **anon public Key**.

### 4. Configurar la Aplicación
1. En la raíz de tu proyecto local, crea un archivo llamado `.env.local`.
2. Pega tus llaves así:

```env
VITE_SUPABASE_URL=tu_url_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

3. Reinicia tu servidor de desarrollo (`npm run dev`).

> [!IMPORTANT]
> Asegúrate de que los nombres de las columnas en el SQL (`destination`, `target_date`, `itinerary`) coincidan exactamente con lo que configuramos en la App.
