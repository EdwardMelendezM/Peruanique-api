'use server'

import {prisma} from '@/lib/prisma'
import {
  CreateQuestionSchema,
  CreateQuestionDTO
} from '@/features/questions/dtos/create-question.dto'
import {
  UpdateQuestionSchema,
  UpdateQuestionDTO
} from '@/features/questions/dtos/update-question.dto'
import {getCurrentUser} from "@/lib/get-user";

export async function createQuestionAction(data: CreateQuestionDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = CreateQuestionSchema.parse(data)
    const question = await prisma.question.create({data: parsed})
    return {success: true, data: question}
  } catch (error: unknown) {
    const err = error as {
      name?: string;
      flatten?: () => { fieldErrors: Record<string, unknown> };
      message?: string
    }
    if (err.name === 'ZodError' && err.flatten) {
      return {success: false, fieldErrors: err.flatten().fieldErrors}
    }
    return {success: false, error: err.message || 'Error creating question'}
  }
}

export async function updateQuestionAction(data: UpdateQuestionDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = UpdateQuestionSchema.parse(data)
    const {id, ...updateData} = parsed
    const question = await prisma.question.update({where: {id}, data: updateData})
    return {success: true, data: question}
  } catch (error: unknown) {
    const err = error as {
      name?: string;
      flatten?: () => { fieldErrors: Record<string, unknown> };
      message?: string
    }
    if (err.name === 'ZodError' && err.flatten) {
      return {success: false, fieldErrors: err.flatten().fieldErrors}
    }
    return {success: false, error: err.message || 'Error updating question'}
  }
}

export async function deleteQuestionAction(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    await prisma.question.delete({where: {id}})
    return {success: true}
  } catch (error: unknown) {
    const err = error as { message?: string }
    return {success: false, error: err.message || 'Error deleting question'}
  }
}

