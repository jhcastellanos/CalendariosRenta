# Calendarios Renta - Sistema de Gestión de Calendarios para Propiedades de Renta Corta

Un sitio web privado, minimalista y responsive para administrar calendarios de propiedades de renta corta con sincronización automática desde Airbnb y VRBO.

## Características

✨ **Multi-plataforma**: Conecta calendarios de Airbnb y VRBO simultáneamente
📅 **Sincronización automática**: Importa reservas desde múltiples fuentes iCal
🧹 **Gestión de limpiezas**: Crea automáticamente tareas de limpieza al finalizar cada estadía
👥 **Roles diferenciados**: Admin completo y vista de solo lectura para equipo de limpieza
🎨 **Diseño minimalista**: Interfaz limpia y responsive construida con Tailwind CSS
🔒 **Seguridad**: Autenticación JWT y cookies seguras

## Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Base de datos**: Neon PostgreSQL con Prisma ORM
- **Autenticación**: JWT + Cookies seguras con bcrypt
- **Estilo**: Tailwind CSS 3.4.6
- **Calendario iCal**: node-ical para parsing de eventos
- **Lenguaje**: TypeScript

## Estructura del Proyecto

```
CalendariosRenta/
├── app/
│   ├── admin/
│   │   └── dashboard/           # Dashboard admin
│   ├── api/
│   │   ├── auth/                # Rutas de autenticación
│   │   ├── properties/          # CRUD de propiedades
│   │   ├── calendar-sources/    # CRUD de fuentes iCal
│   │   ├── sync/                # Sincronización de calendarios
│   │   └── cleanings/           # Gestión de limpiezas
│   ├── cleaning/
│   │   └── dashboard/           # Dashboard para equipo de limpieza
│   ├── properties/              # Listado y detalle de propiedades
│   ├── login/                   # Página de inicio de sesión
│   └── layout.tsx               # Layout raíz
├── components/
│   ├── CalendarSourceManager.tsx    # Gestor de fuentes iCal
│   ├── ReservationCalendar.tsx      # Visualización de reservas
│   ├── CleaningList.tsx             # Lista de limpiezas
│   ├── TopBar.tsx                   # Barra superior
│   └── ...
├── lib/
│   ├── auth.ts                  # Funciones de autenticación
│   ├── ical.ts                  # Sincronización de calendarios
│   ├── prisma.ts                # Cliente de Prisma
│   └── ...
├── prisma/
│   └── schema.prisma            # Esquema de base de datos
├── .env                         # Variables de entorno
└── package.json
```

## Instalación

### 1. Requisitos Previos

- Node.js 18+ y npm
- Una base de datos PostgreSQL (recomendado: [Neon](https://neon.tech))

### 2. Configurar la Base de Datos

1. **Crear un proyecto en Neon**:
   - Ve a https://console.neon.tech
   - Crea un nuevo proyecto
   - Copia la cadena de conexión (DATABASE_URL)

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```

3. **Editar `.env` con tus valores**:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
   JWT_SECRET="genera-una-clave-segura-aqui"
   COOKIE_SECRET="genera-otra-clave-segura-aqui"
   ```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Crear Base de Datos

```bash
npm run prisma:push
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Uso

### Acceso Inicial

1. La primera vez que ingreses, puedes usar los usuarios precreados:
   - **Admin**: `admin` / `admin123`
   - **Cleaner**: `clean` / `clean123`

2. Ve a `http://localhost:3000/login` e ingresa las credenciales

### Panel Admin (`/admin/dashboard`)

**Funcionalidades**:
- Vista de todas las propiedades
- Próximas 6 reservas activas
- Próximas 8 limpiezas pendientes
- Acceso a gestión de propiedades y calendarios

### Panel de Limpieza (`/cleaning/dashboard`)

**Funcionalidades**:
- Listado de limpiezas del mes actual
- Filtros por propiedad y plataforma (Airbnb/VRBO)
- Botones para marcar como completada o cancelada

### Gestionar Propiedades (`/properties`)

1. Crea una nueva propiedad con:
   - Nombre
   - Descripción
   - URL de foto (opcional)

### Conectar Calendarios (`/properties/[id]`)

1. En la página de detalle de la propiedad, usa **"Calendarios conectados"**
2. Agregar fuente iCal:
   - **Plataforma**: Selecciona Airbnb o VRBO
   - **URL iCal**: Pega la URL del calendario exportado
   - **Color**: Personaliza el color de visualización (opcional)
   - **Estado**: Activo por defecto

3. **Acciones disponibles**:
   - ✓ **Sincronizar**: Actualiza las reservas de esa fuente
   - 🔄 **Sincronizar todos**: Actualiza todas las fuentes de la propiedad
   - ✕ **Eliminar**: Remueve la fuente (no afecta reservas existentes)

### Obtener URLs iCal

**Airbnb**:
1. Ve a tu calendario de Airbnb
2. Haz clic en "Ical" o "Export Calendar"
3. Copia la URL del calendario compartido

**VRBO/HomeAway**:
1. Ve a tu calendario de VRBO
2. Busca "Export Calendar" o "iCal"
3. Copia la URL de exportación

## Base de Datos - Esquema

### Tablas Principales

**users**
- Usuarios del sistema con roles (admin/cleaning)
- Contraseñas hasheadas con bcrypt

**properties**
- Propiedades de renta corta
- Foto, descripción, título

**calendar_sources**
- Fuentes iCal conectadas por propiedad
- Tipo (airbnb/vrbo), URL, color, estado

**reservations**
- Reservas importadas desde iCal
- Fechas de check-in/check-out, estado

**cleanings**
- Tareas de limpieza generadas automáticamente
- Vinculadas a reservas, con fecha y estado

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Propiedades
- `GET /api/properties` - Listar todas las propiedades
- `GET /api/properties/[id]` - Obtener detalle
- `POST /api/properties` - Crear propiedad
- `PATCH /api/properties/[id]` - Actualizar propiedad

### Fuentes de Calendario
- `GET /api/calendar-sources` - Listar fuentes
- `POST /api/calendar-sources` - Crear fuente
- `DELETE /api/calendar-sources/[id]` - Eliminar fuente

### Sincronización
- `POST /api/sync` - Sincronizar calendarios (con `sourceId` o `propertyId`)

### Limpiezas
- `GET /api/cleanings` - Listar limpiezas (con filtros)
- `PATCH /api/cleanings/[id]` - Actualizar estado

## Seguridad

- ✓ Autenticación JWT con tokens seguros
- ✓ Cookies HTTP-only para almacenamiento
- ✓ Contraseñas hasheadas con bcrypt
- ✓ Control de acceso basado en roles (RBAC)
- ✓ Validación de entradas en API
- ✓ Variables de entorno para secretos

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión PostgreSQL | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Clave para firmar JWT | (generar una clave segura) |
| `COOKIE_SECRET` | Clave para cookies | (generar una clave segura) |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la app | `Calendarios Renta` |

## Scripts Disponibles

```bash
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Compilar para producción
npm run start            # Iniciar servidor de producción
npm run lint             # Ejecutar ESLint
npm run prisma:generate  # Generar cliente de Prisma
npm run prisma:push      # Sincronizar esquema con BD
npm run seed             # Sembrar datos de prueba
```

## Características Pendientes

- [ ] Editar/actualizar URLs y colores de fuentes existentes
- [ ] Sincronización automática programada (cron jobs)
- [ ] Exportar calendario como iCal
- [ ] Reportes y estadísticas
- [ ] Notificaciones de nuevas reservas
- [ ] Integración con Slack/Email
- [ ] Optimización móvil avanzada

## Licencia

MIT

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para gestión eficiente de propiedades de renta corta**
