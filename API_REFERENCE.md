# API Reference - Calendarios Renta

## Base URL
```
http://localhost:3000/api
```

## Authentication

Todos los endpoints (excepto login) requieren:
1. **Cookie**: `session` (JWT token)
2. **Header**: `Content-Type: application/json` (para POST/PATCH)

### Headers Requeridos
```
Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Autenticación

### POST /auth/login
**Descripción**: Iniciar sesión del usuario

**Request Body**:
```json
{
  "email": "admin",
  "password": "admin123"
}
```

**Response Success (200)**:
```json
{
  "message": "Sesión iniciada correctamente",
  "session": {
    "id": "uuid",
    "userId": "uuid",
    "email": "admin",
    "role": "admin",
    "expiresAt": "2025-05-19T12:00:00Z"
  }
}
```

**Response Error (401)**:
```json
{
  "error": "Email o contraseña inválidos"
}
```

---

### POST /auth/logout
**Descripción**: Cerrar sesión actual

**Request Body**: (vacío)

**Response Success (200)**:
```json
{
  "message": "Sesión cerrada correctamente"
}
```

**Requires Auth**: ✓ Sí

---

### GET /auth/session
**Descripción**: Obtener información de sesión actual

**Response Success (200)**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "email": "admin",
  "role": "admin",
  "expiresAt": "2025-05-19T12:00:00Z"
}
```

**Response Error (401)**:
```json
{
  "error": "No autorizado"
}
```

**Requires Auth**: ✓ Sí

---

## Propiedades

### GET /properties
**Descripción**: Listar todas las propiedades

**Query Parameters**: (opcional)
- `skip` (number): Registros a saltar (default: 0)
- `take` (number): Cantidad de registros (default: 10)

**Response Success (200)**:
```json
{
  "properties": [
    {
      "id": "uuid",
      "title": "Departamento Centro",
      "description": "Depto de 2 dormitorios",
      "photoUrl": "https://...",
      "createdAt": "2025-05-17T10:00:00Z",
      "updatedAt": "2025-05-17T10:00:00Z"
    }
  ],
  "total": 5
}
```

**Requires Auth**: ✓ Sí (Admin)

---

### GET /properties/[id]
**Descripción**: Obtener detalle de una propiedad específica

**Path Parameters**:
- `id` (string): ID de la propiedad

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Departamento Centro",
  "description": "Depto de 2 dormitorios",
  "photoUrl": "https://...",
  "sources": [
    {
      "id": "uuid",
      "sourceType": "airbnb",
      "icalUrl": "https://airbnb.com/ical/...",
      "color": "#f15a5a",
      "active": true,
      "createdAt": "2025-05-17T10:00:00Z"
    }
  ],
  "reservations": [
    {
      "id": "uuid",
      "guestName": "Juan García",
      "checkInDate": "2025-05-20T14:00:00Z",
      "checkOutDate": "2025-05-23T11:00:00Z",
      "status": "active",
      "sourceType": "airbnb"
    }
  ],
  "cleanings": [
    {
      "id": "uuid",
      "cleaningDate": "2025-05-23T12:00:00Z",
      "status": "pending",
      "reservationId": "uuid"
    }
  ]
}
```

**Response Error (404)**:
```json
{
  "error": "Propiedad no encontrada"
}
```

**Requires Auth**: ✓ Sí (Admin)

---

### POST /properties
**Descripción**: Crear nueva propiedad

**Request Body**:
```json
{
  "title": "Departamento Centro",
  "description": "Depto de 2 dormitorios en zona centro",
  "photoUrl": "https://example.com/photo.jpg"
}
```

**Response Success (201)**:
```json
{
  "id": "uuid",
  "title": "Departamento Centro",
  "description": "Depto de 2 dormitorios en zona centro",
  "photoUrl": "https://example.com/photo.jpg",
  "createdAt": "2025-05-18T10:00:00Z"
}
```

**Response Error (400)**:
```json
{
  "error": "El título es requerido"
}
```

**Requires Auth**: ✓ Sí (Admin)

---

### PATCH /properties/[id]
**Descripción**: Actualizar propiedad existente

**Path Parameters**:
- `id` (string): ID de la propiedad

**Request Body** (todos opcionales):
```json
{
  "title": "Departamento Centro Mejorado",
  "description": "Descripción actualizada",
  "photoUrl": "https://example.com/new-photo.jpg"
}
```

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Departamento Centro Mejorado",
  "description": "Descripción actualizada",
  "photoUrl": "https://example.com/new-photo.jpg",
  "updatedAt": "2025-05-18T11:00:00Z"
}
```

**Requires Auth**: ✓ Sí (Admin)

---

## Fuentes de Calendario

### GET /calendar-sources
**Descripción**: Listar todas las fuentes iCal

**Query Parameters** (opcional):
- `propertyId` (string): Filtrar por propiedad

**Response Success (200)**:
```json
{
  "sources": [
    {
      "id": "uuid",
      "propertyId": "uuid",
      "sourceType": "airbnb",
      "icalUrl": "https://airbnb.com/ical/a1b2c3...",
      "color": "#f15a5a",
      "active": true,
      "createdAt": "2025-05-17T10:00:00Z",
      "property": {
        "id": "uuid",
        "title": "Departamento Centro"
      }
    }
  ]
}
```

**Requires Auth**: ✓ Sí (Admin)

---

### POST /calendar-sources
**Descripción**: Crear nueva fuente iCal

**Request Body**:
```json
{
  "propertyId": "uuid",
  "sourceType": "airbnb",
  "icalUrl": "https://www.airbnb.com/calendar/ical/a1b2c3d4e5f6g7h8.ics",
  "color": "#f15a5a",
  "active": true
}
```

**Validación**:
- `propertyId`: Requerido, debe existir
- `sourceType`: Requerido, enum: ["airbnb", "vrbo"]
- `icalUrl`: Requerido, debe ser URL válida
- `color`: Opcional, formato HEX (default: según sourceType)
- `active`: Opcional, boolean (default: true)

**Response Success (201)**:
```json
{
  "id": "uuid",
  "propertyId": "uuid",
  "sourceType": "airbnb",
  "icalUrl": "https://www.airbnb.com/calendar/ical/...",
  "color": "#f15a5a",
  "active": true,
  "createdAt": "2025-05-18T10:00:00Z"
}
```

**Response Error (400)**:
```json
{
  "error": "La URL iCal es requerida"
}
```

**Requires Auth**: ✓ Sí (Admin)

---

### DELETE /calendar-sources/[id]
**Descripción**: Eliminar fuente iCal

**Path Parameters**:
- `id` (string): ID de la fuente

**Response Success (200)**:
```json
{
  "message": "Fuente eliminada correctamente",
  "id": "uuid"
}
```

**Response Error (404)**:
```json
{
  "error": "Fuente no encontrada"
}
```

**Requires Auth**: ✓ Sí (Admin)

---

## Sincronización

### POST /sync
**Descripción**: Sincronizar calendarios iCal

**Request Body - Opción 1 (Sincronizar fuente específica)**:
```json
{
  "sourceId": "uuid"
}
```

**Request Body - Opción 2 (Sincronizar todas las fuentes de propiedad)**:
```json
{
  "propertyId": "uuid"
}
```

**Proceso de sincronización**:
1. Descarga eventos iCal desde URL
2. Extrae información de eventos (UID, summary, start, end, status)
3. Crea o actualiza Reservation records
4. Genera Cleaning automáticas para check-out
5. Detecta cambios de estado (cancelaciones)

**Response Success (200)**:
```json
{
  "message": "Sincronización completada para todos los calendarios",
  "synced": {
    "created": 5,
    "updated": 2,
    "deleted": 0,
    "total": 7
  },
  "cleaningsGenerated": 5
}
```

**Response Error (400)**:
```json
{
  "error": "Propiedad no encontrada"
}
```

**Response Error (503)**:
```json
{
  "error": "No se pudo leer el calendario: Network error"
}
```

**Requires Auth**: ✓ Sí (Admin)

---

## Limpiezas

### GET /cleanings
**Descripción**: Listar limpiezas con filtros

**Query Parameters** (opcionales):
- `propertyId` (string): Filtrar por propiedad
- `status` (string): Filtrar por estado (pending/completed/canceled)
- `sourceType` (string): Filtrar por plataforma (airbnb/vrbo)
- `startDate` (ISO string): Fecha inicio
- `endDate` (ISO string): Fecha fin

**Response Success (200)**:
```json
{
  "cleanings": [
    {
      "id": "uuid",
      "propertyId": "uuid",
      "reservationId": "uuid",
      "cleaningDate": "2025-05-23T12:00:00Z",
      "status": "pending",
      "createdAt": "2025-05-18T10:00:00Z",
      "reservation": {
        "id": "uuid",
        "guestName": "Juan García",
        "sourceType": "airbnb",
        "checkOutDate": "2025-05-23T11:00:00Z"
      },
      "property": {
        "id": "uuid",
        "title": "Departamento Centro"
      }
    }
  ],
  "total": 45
}
```

**Requires Auth**: ✓ Sí (Admin o Cleaning)

---

### PATCH /cleanings/[id]
**Descripción**: Actualizar estado de limpieza

**Path Parameters**:
- `id` (string): ID de la limpieza

**Request Body**:
```json
{
  "status": "completed"
}
```

**Valores válidos de status**:
- `pending` - Pendiente
- `completed` - Completada
- `canceled` - Cancelada

**Response Success (200)**:
```json
{
  "id": "uuid",
  "status": "completed",
  "updatedAt": "2025-05-18T14:30:00Z",
  "message": "Limpieza marcada como completada"
}
```

**Response Error (404)**:
```json
{
  "error": "Limpieza no encontrada"
}
```

**Response Error (400)**:
```json
{
  "error": "Estado inválido"
}
```

**Requires Auth**: ✓ Sí (Admin o Cleaning)

---

## Errores Comunes

### 401 Unauthorized
**Causa**: Sesión expirada o no autenticado

```json
{
  "error": "No autorizado"
}
```

**Solución**: Hacer login nuevamente

---

### 403 Forbidden
**Causa**: Usuario sin permisos para esta acción

```json
{
  "error": "Acceso denegado"
}
```

**Solución**: Verificar rol (requiere admin)

---

### 404 Not Found
**Causa**: Recurso no encontrado

```json
{
  "error": "Propiedad no encontrada"
}
```

**Solución**: Verificar ID correcto

---

### 400 Bad Request
**Causa**: Datos inválidos o incompletos

```json
{
  "error": "El título es requerido"
}
```

**Solución**: Revisar validación en documentación

---

### 503 Service Unavailable
**Causa**: Error al conectar con URL iCal

```json
{
  "error": "No se pudo leer el calendario: Connection timeout"
}
```

**Solución**: Verificar que URL iCal sea accesible

---

## Rate Limiting

- Sin implementar actualmente
- Recomendado: 100 requests/minuto por IP en producción

---

## Ejemplos de Uso

### Ejemplo 1: Login y obtener sesión
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin",
    "password": "admin123"
  }'

# Respuesta incluye cookie en Set-Cookie header
# Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Obtener sesión actual (con cookie)
curl http://localhost:3000/api/auth/session \
  -H "Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Ejemplo 2: Crear propiedad y conectar calendario
```bash
# Crear propiedad
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "title": "Departamento Centro",
    "description": "Depto de 2 dormitorios",
    "photoUrl": "https://example.com/photo.jpg"
  }'

# Respuesta: { "id": "prop-123", ... }

# Agregar calendario Airbnb
curl -X POST http://localhost:3000/api/calendar-sources \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "propertyId": "prop-123",
    "sourceType": "airbnb",
    "icalUrl": "https://www.airbnb.com/calendar/ical/a1b2c3...",
    "color": "#f15a5a",
    "active": true
  }'

# Respuesta: { "id": "source-456", ... }
```

---

### Ejemplo 3: Sincronizar todos los calendarios
```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "propertyId": "prop-123"
  }'

# Respuesta: { "message": "...", "synced": { "created": 5, ... } }
```

---

### Ejemplo 4: Listar y actualizar limpiezas
```bash
# Listar limpiezas del mes actual, estado pendiente
curl "http://localhost:3000/api/cleanings?status=pending&startDate=2025-05-01&endDate=2025-05-31" \
  -H "Cookie: session=..."

# Marcar limpieza como completada
curl -X PATCH http://localhost:3000/api/cleanings/cleaning-789 \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "status": "completed"
  }'
```

---

## Changelog

### v1.0.0 (2025-05-18)
- ✅ API completa implementada
- ✅ Autenticación JWT
- ✅ CRUD de propiedades
- ✅ Multi-fuente iCal (Airbnb/VRBO)
- ✅ Sincronización automática
- ✅ Gestión de limpiezas
- ✅ Roles diferenciados

---

**API Reference - Calendarios Renta**
**Versión**: 1.0.0
**Fecha**: 2025-05-18
