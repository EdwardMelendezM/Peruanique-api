'use server'

import { CreateCourseSchema, CreateCourseDTO } from '@/features/courses/dtos/create-course.dto'
import { UpdateCourseSchema, UpdateCourseDTO } from '@/features/courses/dtos/update-course.dto'
import {getCurrentUser} from "@/lib/get-user";
import {prisma} from "@/lib/prisma";

/**
 * Server Action: Create a new course
 * Validates input with Zod and checks admin privileges
 */
export async function createCourseAction(data: CreateCourseDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = CreateCourseSchema.parse(data)
    const course = await prisma.course.create({ data: parsed })
    return { success: true, data: course }
  } catch (error: unknown) {
    const err = error as { name?: string; flatten?: () => { fieldErrors: Record<string, unknown> }; message?: string }
    if (err.name === 'ZodError' && err.flatten) {
      return { success: false, fieldErrors: err.flatten().fieldErrors }
    }
    return { success: false, error: err.message || 'Error creating course' }
  }
}

/**
 * Server Action: Update an existing course
 * Validates input with Zod and checks admin privileges
 */
export async function updateCourseAction(data: UpdateCourseDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = UpdateCourseSchema.parse(data)
    const { id, ...updateData } = parsed

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
    })

    return { success: true, data: course }
  } catch (error: unknown) {
    const err = error as { name?: string; flatten?: () => { fieldErrors: Record<string, unknown> }; message?: string }
    if (err.name === 'ZodError' && err.flatten) {
      return { success: false, fieldErrors: err.flatten().fieldErrors }
    }
    return { success: false, error: err.message || 'Error updating course' }
  }
}

/**
 * Server Action: Delete a course
 * Checks admin privileges before deletion
 */
export async function deleteCourseAction(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    await prisma.course.delete({ where: { id } })
    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, error: err.message || 'Error deleting course' }
  }
}

