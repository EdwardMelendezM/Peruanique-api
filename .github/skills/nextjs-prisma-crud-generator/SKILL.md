# Skill: nextjs-prisma-crud-generator

## 🎯 Purpose
Generar Server Actions CRUD estandarizados en Next.js 15+, integrando validación con Zod, tipado estricto de Prisma y manejo de errores limpio para la UI.

## 🛠️ Requirements & Context
- **Stack:** Next.js 16+, Prisma ORM, TypeScript, Zod.
- **Dependency:** - `@/lib/db` o `@/lib/prisma` para la instancia de BD.
  - `@/lib/utils/zod-errors` con la función `getValidationErrors`
- **Target Path:** `actions/[modelName].ts`.

## 📝 Execution Protocol
1. **Schema Validation**: Todo input `unknown` debe ser validado con un esquema de Zod antes de tocar la BD.
2. **Error Formatting**: Si la validación falla, retornar `success: false` con los errores formateados mediante `getValidationErrors`.
3. **Security**: Verificar `getCurrentUser()` en operaciones de escritura.
4. **Cache**: Usar `revalidatePath` o `revalidateTag` tras mutaciones exitosas.
5. **Types**: Usar `Prisma.ModelGetPayload<{}>` o modelos generados para el retorno.

## 🚫 Constraints
- **NO DIRECT INPUTS**: Nunca pasar el objeto `input` directo a Prisma sin validación previa.
- **KISS UI**: Retornar solo el primer error por campo en `details` si la UI lo requiere, o el array completo.
- **SERVER ONLY**: Forzar `"use server"` al inicio del archivo.
