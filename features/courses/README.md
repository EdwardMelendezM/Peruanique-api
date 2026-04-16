# Feature: Courses

## Overview
La feature **Courses** maneja la gestión de cursos en la plataforma FIJA. Proporciona un CRUD completo para administradores y exposición de datos de cursos para usuarios.

## Estructura

```
features/courses/
├── actions/
│   └── course-actions.ts      # Server Actions (create, update, delete)
├── components/
│   ├── course-form.tsx        # Formulario para crear/editar
│   └── course-table.tsx       # Tabla con listado de cursos
├── dtos/
│   ├── create-course.dto.ts   # DTO y Zod schema para CREATE
│   └── update-course.dto.ts   # DTO y Zod schema para UPDATE
├── screens/
│   ├── course-new-screen.tsx   # Pantalla de creación
│   ├── course-edit-screen.tsx  # Pantalla de edición
│   └── course-list-screen.tsx  # Pantalla de listado
└── services/
    └── course-services.ts     # Lógica de negocio reutilizable
```

## DTOs y Validación

Todos los DTOs usan **Zod** para validación declarativa:

- **CreateCourseSchema**: Valida nombre (2-100 caracteres), color_theme (opcional), icon_url (URL válida, opcional)
- **UpdateCourseSchema**: Igual que CREATE pero con id requerido como UUID

## Server Actions

### `createCourseAction(data: CreateCourseDTO)`
Crea un nuevo curso. Valida admin, ejecuta Zod parse y retorna `{ success: boolean, data?, error?, fieldErrors? }`

### `updateCourseAction(data: UpdateCourseDTO)`
Actualiza un curso existente. Mismo flujo que create.

### `deleteCourseAction(id: string)`
Elimina un curso. Solo retorna `{ success: boolean, error? }`

## Componentes UI

### CourseForm
Formulario client-side que:
- Detecta si es CREATE o UPDATE por prop `course?`
- Maneja errores de validación por campo
- Redirige a `/admin/courses` después de guardar
- Muestra loader durante envío

### CourseTable
Tabla client-side que:
- Renderiza lista de cursos
- Modal de confirmación para eliminar (SweetAlert-like)
- Dropdown menu con acciones (Edit, Delete)
- Integración con `sonner` para notificaciones

## Screens

Las screens actúan como contenedores que orquestan componentes:

- **CoursesListScreen**: Tabla + botón de crear
- **CourseNewScreen**: Formulario vacío
- **CourseEditScreen**: Formulario pre-populated

## Pages de Administración

### `/admin/courses`
Listado de todos los cursos

### `/admin/courses/new`
Formulario para crear nuevo curso

### `/admin/courses/[id]`
Formulario para editar curso existente

## Validación y Errores

Todos los errores de validación Zod se mapean al formulario:

```typescript
if (result.fieldErrors) {
  Object.entries(result.fieldErrors).forEach(([key, value]) => {
    setError(key, { message: value?.[0] })
  })
}
```

## Patrones Seguidos

✅ **Feature-Scoped**: Todo está contenido en `features/courses/`  
✅ **Server Actions**: Todas las mutaciones usan 'use server'  
✅ **Zod Validation**: DTO schemas para input validation  
✅ **Admin Check**: Todas las acciones verifican privilegios admin  
✅ **Skills-Based**: Sigue templates de `.github/skills/`  
✅ **Error Handling**: Feedback granular por campo  
✅ **Optimistic UI**: Loaders y disabled states  

## Testing

Para probar manualmente:

```bash
# Crear curso
curl -X POST http://localhost:3000/admin/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"Matemáticas","color_theme":"#FF5733"}'

# Listar
GET http://localhost:3000/admin/courses

# Editar
PATCH http://localhost:3000/admin/courses/[id]

# Eliminar
DELETE http://localhost:3000/admin/courses/[id]
```

## Próximos Pasos

- [ ] Integrar con mejor-auth para autenticación real
- [ ] Agregar filtros y paginación a la tabla
- [ ] Crear tests unitarios para validaciones Zod
- [ ] Agregar soft delete en lugar de delete inmediato
- [ ] Implementar auditoría de cambios

