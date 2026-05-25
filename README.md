# Calendarios Renta

Aplicación privada para administrar calendarios de propiedades de renta corta.

## Características

- Autenticación con usuario y contraseña.
- Roles: `admin` y `cleaning`.
- Conexión a Neon PostgreSQL.
- Sincronización de calendarios iCal de Airbnb y VRBO.
- Reservas y limpiezas generadas automáticamente según la fecha de check-out.
- Dashboard diferente para administrador y equipo de limpieza.

## Configuración

1. Copia `.env.example` a `.env`.
2. Ajusta `DATABASE_URL`, `JWT_SECRET` y `COOKIE_SECRET`.
3. Instala dependencias:

```bash
npm install
```

4. Genera el cliente de Prisma:

```bash
npx prisma generate
```

5. Sincroniza el esquema con la base de datos:

```bash
npx prisma db push
```

6. Ejecuta el proyecto:

```bash
npm run dev
```

## Estructura principal

- `app/`: interfaz de páginas.
- `app/api/`: rutas de autenticación y datos.
- `lib/`: conexión a la base de datos, funciones de sesión y sincronización iCal.
- `prisma/`: modelo de datos y seed inicial.
