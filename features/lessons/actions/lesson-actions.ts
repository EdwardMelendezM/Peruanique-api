'use server'

import { prisma } from '@/lib/prisma'
import { CreateLessonSchema, CreateLessonDTO } from '@/features/lessons/dtos/create-lesson.dto'
import { UpdateLessonSchema, UpdateLessonDTO } from '@/features/lessons/dtos/update-lesson.dto'
import {getCurrentUser} from "@/lib/get-user";

/**
 * Server Action: Crear una nueva lección
 * @param data - Datos validados de la lección
 * @returns { success: boolean, data?: RoadmapNode, error?: string, fieldErrors?: Record<string, unknown> }
 */
export async function createLessonAction(data: CreateLessonDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = CreateLessonSchema.parse(data)
    const lesson = await prisma.roadmapNode.create({
      data: {
        courseId: parsed.courseId,
        title: parsed.title,
        order_index: parsed.order_index,
        difficulty_level: parsed.difficulty_level,
        is_boss_level: false,
      },
    })
    return { success: true, data: lesson }
  } catch (error: unknown) {
    const err = error as { name?: string; flatten?: () => { fieldErrors: Record<string, unknown> }; message?: string }
    if (err.name === 'ZodError' && err.flatten) {
      return { success: false, fieldErrors: err.flatten().fieldErrors }
    }
    return { success: false, error: err.message || 'Error creating lesson' }
  }
}

/**
 * Server Action: Actualizar una lección existente
 */
export async function updateLessonAction(data: UpdateLessonDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = UpdateLessonSchema.parse(data)
    const { id, ...updateData } = parsed
    const lesson = await prisma.roadmapNode.update({
      where: { id },
      data: updateData,
    })
    return { success: true, data: lesson }
  } catch (error: unknown) {
    const err = error as { name?: string; flatten?: () => { fieldErrors: Record<string, unknown> }; message?: string }
    if (err.name === 'ZodError' && err.flatten) {
      return { success: false, fieldErrors: err.flatten().fieldErrors }
    }
    return { success: false, error: err.message || 'Error updating lesson' }
  }
}

/**
 * Server Action: Eliminar una lección
 */
export async function deleteLessonAction(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    await prisma.roadmapNode.delete({ where: { id } })
    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, error: err.message || 'Error deleting lesson' }
  }
}

/**
 * Server Action: Publicar/despublicar una lección
 */
export async function togglePublishLessonAction(id: string, isPublished: boolean) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const lesson = await prisma.roadmapNode.update({
      where: { id },
      data: { is_boss_level: isPublished },
    })
    return { success: true, data: lesson }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, error: err.message || 'Error toggling lesson publish status' }
  }
}

