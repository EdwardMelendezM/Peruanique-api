import {CreateUserSchema} from "@/features/users/dtos/create-user.dto";
import {ApiResponse} from "@/shared/response/api-response";
import {UserService} from "@/features/users/services/user-services";
import {isPrismaError} from "@/shared/utils/error-handler";
import {NextRequest} from "next/server";
import {parseQueryParams} from "@/shared/utils/query-parser";
import {PaginationSchema} from "@/shared/dtos/pagination.dto";

export async function POST(request: Request) {
  try {
    // 1. Validar que el cuerpo sea un JSON válido
    const body = await request.json();
    // 2. Validación Estructural con Zod
    const result = CreateUserSchema.safeParse(body);

    if (!result.success) {
      // Usamos flatten() para un formato de error más limpio en el cliente
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    // 3. Lógica de Negocio
    const newUser = await UserService.createUser(result.data);

    return ApiResponse.success(newUser, 201);

  } catch (error: unknown) { // <-- Cambiamos any por unknown
    console.error('[ERROR_CREATE_USER]:', error);

    // Controlamos errores de Base de Datos (Prisma)
    if (isPrismaError(error)) {
      if (error.code === 'P2002') {
        return ApiResponse.error('Email already exists', 409);
      }
    }

    // Controlamos errores genéricos
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. Extraer todos los params de forma automática
    const rawParams = parseQueryParams(request.url);

    // 2. Validar con el Schema reutilizable de paginación
    const result = PaginationSchema.safeParse(rawParams);

    if (!result.success) {
      return ApiResponse.error(
        'Invalid query parameters',
        422,
        result.error.flatten().fieldErrors
      );
    }

    // 3. Llamada al servicio (que ya usa el helper de paginación)
    const { data, meta } = await UserService.getAllUsers(result.data);

    // 4. Respuesta estandarizada
    return ApiResponse.success({ items: data, meta });

  } catch (error: unknown) {
    console.error("[ERROR_GET_USERS]:", error);

    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      isDev ? message : 'Internal Server Error',
      500
    );
  }
}
