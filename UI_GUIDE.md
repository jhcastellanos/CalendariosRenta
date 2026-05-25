# Guía Visual de la Interfaz

## Descripción General de Pantallas

### 1. Página de Login
```
┌─────────────────────────────────────────────┐
│                                             │
│          Calendarios Renta                 │
│          Sistema de Gestión                │
│                                             │
│  Email:      [___________________________]  │
│  Contraseña: [___________________________]  │
│                                             │
│              [ Iniciar Sesión ]            │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 2. Dashboard Admin
```
┌─────────────────────────────────────────────────────────────────┐
│ Calendarios Renta                             [Admin] [Logout]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PANEL DE ADMINISTRACIÓN                                       │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ Próximas Reservas   │  │ Próximas Limpiezas  │             │
│  │ 6 activas           │  │ 8 pendientes        │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
│  PROPIEDADES                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ 🏠 Departamento  │  │ 🏠 Casa Centro   │  │ 🏠 Villa     │ │
│  │ Airbnb: 3        │  │ VRBO: 2          │  │ Airbnb+VRBO  │ │
│  │ VRBO: 1          │  │ Limpiezas: 5     │  │ Multi-fuente │ │
│  │ [Editar]         │  │ [Editar]         │  │ [Editar]     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. Página de Propiedades (Listado)
```
┌─────────────────────────────────────────────────────────────────┐
│ Calendarios Renta                             [Admin] [Logout]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROPIEDADES                          [+ Nueva Propiedad]     │
│                                                                 │
│  📋 Filtrar por nombre: [_______________]                      │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 🏠 Departamento Centro                                      ││
│  │ Descripción: Depto de 2 dormitorios en zona centro         ││
│  │ Conexiones: 3 Airbnb + 1 VRBO                              ││
│  │ Próxima reserva: 2025-05-20                                ││
│  │                              [Ver Detalles] [Editar]       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 🏠 Villa Playa                                              ││
│  │ Descripción: Casa de 4 habitaciones con piscina            ││
│  │ Conexiones: 2 VRBO                                          ││
│  │ Próxima reserva: 2025-05-25                                ││
│  │                              [Ver Detalles] [Editar]       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Detalle de Propiedad - Gestión de Calendarios
```
┌─────────────────────────────────────────────────────────────────┐
│ Calendarios Renta > Propiedades > Departamento Centro           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Propiedad: Departamento Centro                                │
│  Conecta calendarios de Airbnb y VRBO...                       │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐ │
│  │ Foto:               │  │ Conexiones: 4 calendarios        │ │
│  │                     │  │ - 3 Airbnb                       │ │
│  │ [Imagen]            │  │ - 1 VRBO                         │ │
│  │                     │  │ [Sincronizar todos] ⟳            │ │
│  └─────────────────────┘  └──────────────────────────────────┘ │
│                                                                 │
│  CALENDARIOS CONECTADOS - Sincronizar todos ⟳                 │
│                                                                 │
│  ┌─ AIRBNB (3 calendarios) ────────────────────────────────────┐│
│  │                                                              ││
│  │  ✓ Calendario iCal (Activo)                                 ││
│  │  URL: https://airbnb.com/ical/a1b2c3...                     ││
│  │  Conectado: 15 may 2025                                     ││
│  │                          [Sincronizar] [Eliminar]          ││
│  │                                                              ││
│  │  ✓ Calendario iCal (Activo)                                 ││
│  │  URL: https://airbnb.com/ical/d4e5f6...                     ││
│  │  Conectado: 16 may 2025                                     ││
│  │                          [Sincronizar] [Eliminar]          ││
│  │                                                              ││
│  │  ✓ Calendario iCal (Inactivo)                               ││
│  │  URL: https://airbnb.com/ical/g7h8i9...                     ││
│  │  Conectado: 14 may 2025                                     ││
│  │                          [Sincronizar] [Eliminar]          ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ VRBO (1 calendario) ───────────────────────────────────────┐│
│  │                                                              ││
│  │  ✓ Calendario iCal (Activo)                                 ││
│  │  URL: https://vrbo.com/ical/xyz123...                       ││
│  │  Conectado: 17 may 2025                                     ││
│  │                          [Sincronizar] [Eliminar]          ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  AGREGAR NUEVO CALENDARIO                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Plataforma: [Airbnb ▼]                                     │ │
│  │                                                            │ │
│  │ URL iCal: [Pega aquí la URL del calendario ______]        │ │
│  │ Ej: https://www.airbnb.com/calendar/ical/...              │ │
│  │                                                            │ │
│  │ Color: [██] #f15a5a                                       │ │
│  │        (Haz clic para elegir otro color)                  │ │
│  │                                                            │ │
│  │ Estado: [✓] Activo                                         │ │
│  │                                                            │ │
│  │                           [Guardar Calendario]            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  RESERVAS ACTIVAS (12 total)                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [AIRBNB] Reserva - Juan García                             │ │
│  │ 20-23 mayo 2025 | Activa                                   │ │
│  │                                                             │ │
│  │ [VRBO] Reserva - María López                               │ │
│  │ 24-27 mayo 2025 | Activa                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  RESUMEN POR PLATAFORMA                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ [AIRBNB]             │  │ [VRBO]               │            │
│  │ 9 reservas activas   │  │ 3 reservas activas   │            │
│  │ 5 completadas        │  │ 2 completadas        │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Dashboard de Limpieza
```
┌─────────────────────────────────────────────────────────────────┐
│ Calendarios Renta                         [Limpieza] [Logout]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LIMPIEZAS - MAYO 2025                                          │
│                                                                 │
│  Filtros:                                                       │
│  Propiedad: [Todas ▼]      Plataforma: [Todas ▼]              │
│  Estado: [Todas ▼]                                             │
│                                                                 │
│  📅 20 mayo 2025 (Lunes)                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [AIRBNB] Dpto Centro                                       │ │
│  │ Reserva completada: Juan García (17:00)                    │ │
│  │ Estado: Pendiente                                          │ │
│  │                    [✓ Completada] [✕ Cancelar]            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📅 21 mayo 2025 (Martes)                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [VRBO] Villa Playa                                         │ │
│  │ Reserva completada: María López (18:30)                    │ │
│  │ Estado: Completada (21 may 14:22)                          │ │
│  │                    [✓ Completada] [✕ Cancelar]            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [AIRBNB] Apartamento Beach                                 │ │
│  │ Reserva completada: Carlos Ruiz (19:00)                    │ │
│  │ Estado: Pendiente                                          │ │
│  │                    [✓ Completada] [✕ Cancelar]            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📅 22 mayo 2025 (Miércoles)                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [AIRBNB] Departamento Centro                               │ │
│  │ Reserva completada: Ana Martínez (17:00)                   │ │
│  │ Estado: Cancelada                                          │ │
│  │                    [✓ Completada] [✕ Cancelar]            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Resumen: 8 pendientes | 5 completadas | 2 canceladas         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Esquema de Colores

### Paleta Principal
```
Airbnb:     #f15a5a (Rojo)    - Badges y bordes
VRBO:       #3b82f6 (Azul)    - Badges y bordes
Accent:     #2563eb (Azul oscuro) - Botones principales
Background: #ffffff (Blanco)  - Fondos
Text:       #0f172a (Negro/Gris oscuro) - Texto
Secondary:  #64748b (Gris)    - Texto secundario
Border:     #e2e8f0 (Gris claro) - Bordes
Success:    #10b981 (Verde)   - Estados completados
Pending:    #f59e0b (Ámbar)   - Estados pendientes
Error:      #ef4444 (Rojo)    - Errores
```

### Componentes Coloreados
```
Card de Airbnb:  Borde izquierdo #f15a5a + Badge #f15a5a
Card de VRBO:    Borde izquierdo #3b82f6 + Badge #3b82f6
Botón primario:  Fondo #2563eb, texto blanco
Botón secundario: Fondo #e2e8f0, texto #0f172a
Estado activo:   Fondo #dbeafe, texto #0369a1
Estado inactivo: Fondo #f3f4f6, texto #6b7280
```

---

## Componentes Reutilizables

### 1. Tarjeta de Fuente iCal
```
┌────────────────────────────────────────────┐
│ ✓ Calendario iCal (Activo)                 │
│ https://airbnb.com/ical/a1b2c3d4e5f6...   │
│ Conectado: 15 may 2025                     │
│           [Sincronizar] [Eliminar]         │
└────────────────────────────────────────────┘
```

### 2. Tarjeta de Reserva
```
┌─────────────────────────────────────────────┐
│ [AIRBNB] Reserva - Juan García (•••)       │
│ 20-23 mayo 2025 | Activa                    │
└─────────────────────────────────────────────┘
```

### 3. Tarjeta de Limpieza
```
┌────────────────────────────────────────────┐
│ [AIRBNB] Dpto Centro                       │
│ Reserva completada: Juan García (17:00)    │
│ Estado: Pendiente                          │
│            [✓ Completada] [✕ Cancelar]    │
└────────────────────────────────────────────┘
```

### 4. Badge de Plataforma
```
Airbnb:  [AIRBNB] - Fondo rojo, texto blanco
VRBO:    [VRBO]   - Fondo azul, texto blanco
```

### 5. Formulario de Fuente iCal
```
┌────────────────────────────────────────────┐
│ Plataforma: [Airbnb ▼]                     │
│ URL iCal: [_____________________________]   │
│ Color: [██] #f15a5a                        │
│ Estado: [✓] Activo                         │
│                      [Guardar Calendario]  │
└────────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints
```
Mobile:        < 640px (sm:)
Tablet:        640px - 1024px (md:)
Desktop:       1024px - 1280px (lg:)
Wide:          > 1280px (xl:)
```

### Adaptaciones por Tamaño
```
📱 Mobile (< 640px):
  - Stack vertical de tarjetas
  - Botones a ancho completo
  - Font más pequeña
  - Menos padding

💻 Desktop (> 1024px):
  - Grid de 2-3 columnas
  - Botones en línea
  - Más espacio
  - Mejor spacing
```

---

## Flujos de Interacción

### Flujo 1: Agregar Calendario
```
Admin hace clic en "Agregar nuevo calendario"
        ↓
Selecciona plataforma (Airbnb/VRBO)
        ↓
Pega URL iCal
        ↓
Personaliza color (opcional)
        ↓
Hace clic "Guardar Calendario"
        ↓
Sistema valida URL
        ↓
Crea CalendarSource en BD
        ↓
Router.refresh() actualiza la página
        ↓
Nueva fuente aparece en listado
```

### Flujo 2: Sincronizar Calendarios
```
Admin hace clic en "Sincronizar todos"
        ↓
Sistema obtiene todas las fuentes del property
        ↓
Para cada fuente:
  - Descarga eventos iCal
  - Extrae VEVENT items
  - Crea/actualiza Reservations
  - Genera Cleanings automáticas
        ↓
Mensaje de éxito
        ↓
Página se actualiza con nuevas reservas
```

### Flujo 3: Equipo de Limpieza Marca Completa
```
Cleaning role ve lista de limpiezas
        ↓
Hace clic "✓ Completada" en limpieza
        ↓
Sistema envía PATCH a /api/cleanings/[id]
        ↓
Valida sesión y rol
        ↓
Actualiza status a "completed"
        ↓
Mensaje de confirmación
        ↓
Tarjeta se actualiza visualmente
```

---

## Mensajes y Notificaciones

### Éxito
```
✓ "Calendario agregado correctamente."
✓ "Sincronización completada para todos los calendarios"
✓ "Fuente eliminada correctamente."
```

### Error
```
✗ "No se pudo agregar la fuente"
✗ "No se pudo eliminar la fuente"
✗ "Error de conexión"
```

### Info
```
ℹ "Sincronizando calendario..."
ℹ "Eliminando fuente..."
ℹ "No hay calendarios conectados para esta propiedad."
```

---

## Accesibilidad

- ✓ Contraste de colores WCAG AA
- ✓ Etiquetas alt en imágenes
- ✓ Botones con aria-labels
- ✓ Navegación con teclado
- ✓ Focus indicators visibles
- ✓ Mensajes de error accesibles

---

**Documento Visual del Proyecto Calendarios Renta**
**Última actualización: 2025-05-18**
