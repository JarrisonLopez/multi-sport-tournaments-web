# Multi Sport Tournaments — frontend

Sitio de la plataforma multideporte, reconstruido con Next.js (App Router), TypeScript y Tailwind. El dominio sigue siendo Multi Sport Tournaments.

## Cómo correrlo en local

Requiere Node.js 20.9 o superior.

```bash
npm install
copy .env.example .env.local
npm run dev
```

La variable `NEXT_PUBLIC_API_HOST` es el host de `multi-sport-tournaments-api`. El ejemplo usa `http://localhost:3000`. Este repositorio no define una URL de producción.

## Estado de esta fase

El catálogo de torneos se pide con `GET /api/torneos` y muestra cargando, vacío o error. No hay un arreglo fijo de torneos en el frontend.

Todavía no están implementados el inicio de sesión, el registro, el envío de inscripciones ni la administración.
