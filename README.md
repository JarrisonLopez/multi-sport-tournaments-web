# Multi Sport Tournaments — frontend

Sitio de la plataforma multideporte, reconstruido con Next.js (App Router), TypeScript y Tailwind CSS. El dominio sigue siendo el de la Entrega 1: torneos, jugadores y canchas.

- Sitio: https://multi-sport-tournaments-web.vercel.app
- API: https://multi-sport-tournaments-api.onrender.com
- Repositorio de la API: https://github.com/JarrisonLopez/multi-sport-tournaments-api

## Tecnologías

Next.js 16, React 19, TypeScript y Tailwind CSS 4.

## Cómo correrlo en local

Requiere Node.js 20.9 o superior y la API corriendo en local.

```bash
npm install
copy .env.example .env.local
npm run dev
```

En este proyecto el servidor de desarrollo se puede abrir en el puerto 3010:

```bash
npx next dev -p 3010
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_API_HOST` | Origen de la API, sin barra final. En local: `http://localhost:3099`. En Vercel apunta a `https://multi-sport-tournaments-api.onrender.com`. |

No hay secretos en el frontend. `.env` y `.env.local` están en `.gitignore`.

## Arquitectura

El código vive en `src/features/`. Cada feature se reparte en `domain`, `services`, `hooks` y `components`.

- `torneos`: catálogo, filtros, paginación y escritura del panel.
- `inscripciones`: formulario y listado propio.
- `auth`: registro, login, sesión y controles de la barra.
- `admin`: panel de torneos.
- `common`: cliente HTTP, encabezado y secciones compartidas.

Ningún componente llama a `fetch`. Las peticiones pasan por `src/features/common/http.ts`, que agrega `Authorization: Bearer <token>` cuando hay sesión.

## Flujo de login

1. El formulario de `/login` valida el correo y la contraseña y llama a `POST /api/auth/login`.
2. Si los datos no sirven, la API responde 401 y el mensaje queda junto al formulario.
3. Si sirven, la API devuelve un JWT y el usuario (`id`, `nombre`, `email`, `role`).
4. El navegador guarda el token en `localStorage` bajo `mst-token` y el usuario bajo `mst-user`.
5. Al recargar, `useAuth` vuelve a leer esa sesión. El cliente HTTP envía el token en las rutas protegidas.
6. Si una respuesta es 401, el cliente borra la sesión y lleva a `/login`, conservando la ruta en `next` cuando aplica.
7. Con sesión activa, `/login` y `/registro` vuelven al inicio. `/admin` solo continúa si `role` es `ADMIN`; un `USER` vuelve al inicio. Sin sesión, `/admin` y `/mis-inscripciones` van a `/login`.

Guardar el token en `localStorage` permite que la sesión sobreviva al refresco sin una cookie de servidor. El riesgo es que cualquier script que corra en la página puede leerlo. Por eso el token no se imprime en la interfaz y un 401 cierra la sesión.

## 401 y 403

- **401** «Token inválido o expirado.»: la petición no trae token o el token no es válido. Ejemplo: `DELETE /api/torneos/t-copa-metro` sin encabezado `Authorization`.
- **401** «Credenciales inválidas.»: el login no coincide. No revela si el correo existe.
- **403** «No tienes permiso para realizar esta acción.»: el token es válido, pero el rol no alcanza. Ejemplo: un usuario `USER` intenta `DELETE /api/torneos/:id`.

## Cuentas de prueba

Son las cuentas del seed, solo para revisar la entrega. No son credenciales personales.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| ADMIN | `admin.mst@example.com` | `CONTRASENA_ADMIN_SEGURA` |
| USER | `usuario.mst@example.com` | `CONTRASENA_USER_SEGURA` |

## Uso de IA

Usé el asistente de Cursor para implementar el cliente HTTP, la sesión, las inscripciones, el panel de administración y el ajuste del encabezado. Corregí a mano los contratos para que coincidieran con la API (el `id` del torneo no viaja en el `PUT`), la redirección de login cuando ya había sesión y el desborde del encabezado: la columna de sesión era más ancha que su celda y se pintaba encima de los enlaces.

## Evidencia de Network

La captura del encabezado `Authorization` en la pestaña Network queda pendiente. No se incluye una imagen de reemplazo.
