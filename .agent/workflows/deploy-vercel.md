---
description: How to deploy the Countdown app to Vercel
---

Para desplegar tu aplicación en Vercel, sigue estos pasos:

### Opción 1: Usando GitHub (Recomendado)

1. **Sube tu código a GitHub**:
   - Crea un repositorio en GitHub.
   - Sigue las instrucciones para subir tu proyecto local:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
     git push -u origin main
     ```

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com) e inicia sesión.
   - Haz clic en **"Add New"** > **"Project"**.
   - Importa tu repositorio de GitHub.
   - Vercel detectará automáticamente que es un proyecto de **Vite**.

3. **Configuración de Despliegue**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - Haz clic en **"Deploy"**.

### Opción 2: Usando Vercel CLI

Si prefieres la terminal, puedes usar la herramienta de comando de Vercel:

1. **Instala la CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Despliega**:
   ```bash
   vercel
   ```
   - Sigue las instrucciones en la terminal (iniciar sesión, confirmar proyecto, etc.).
   - Cuando termine, obtendrás una URL de producción.

> [!TIP]
> Dado que usamos `localStorage`, tu itinerario y destino se guardarán en el navegador de cada usuario que visite la URL desplegada.
