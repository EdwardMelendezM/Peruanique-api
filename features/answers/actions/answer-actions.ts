'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { CreateAnswerSchema, CreateAnswerDTO } from '@/features/answers/dtos/create-answer.dto'
import { UpdateAnswerSchema, UpdateAnswerDTO } from '@/features/answers/dtos/update-answer.dto'
import {getCurrentUser} from "@/lib/get-user";

export async function createAnswerAction(data: CreateAnswerDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = CreateAnswerSchema.parse(data)
    const answer = await prisma.answer.create({ data: parsed })
    return { success: true, data: answer }
  } catch (error: unknown) {
    const err = error as { name?: string; flatten?: () => { fieldErrors: Record<string, unknown> }; message?: string }
    if (err.name === 'ZodError' && err.flatten) {
      return { success: false, fieldErrors: err.flatten().fieldErrors }
    }
    return { success: false, error: err.message || 'Error creating answer' }
  }
}

export async function updateAnswerAction(data: UpdateAnswerDTO) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    const parsed = UpdateAnswerSchema.parse(data)
    const { id, ...updateData } = parsed
    const answer = await prisma.answer.update({ where: { id }, data: updateData })
    return { success: true, data: answer }
  } catch (error: unknown) {
    const err = error as { name?: string; flatten?: () => { fieldErrors: Record<string, unknown> }; message?: string }
    if (err.name === 'ZodError' && err.flatten) {
      return { success: false, fieldErrors: err.flatten().fieldErrors }
    }
    return { success: false, error: err.message || 'Error updating answer' }
  }
}

export async function deleteAnswerAction(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      status: 404,
      error: "User not found",
    }
  }

  try {
    await prisma.answer.delete({ where: { id } })
    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, error: err.message || 'Error deleting answer' }
  }
}

