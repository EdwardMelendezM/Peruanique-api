import { headers } from 'next/headers'
import { prisma } from '@/libs/prisma'
import { requireAdminOrThrow } from '@/libs/admin'

// Server actions for admin management. Each action expects a FormData (used from server components forms)

export async function createCourse(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const name = formData.get('name')?.toString() || ''
  const color_theme = formData.get('color_theme')?.toString() || null
  const icon_url = formData.get('icon_url')?.toString() || null

  const course = await prisma.course.create({ data: { name, color_theme, icon_url } })
  return course
}

export async function updateCourse(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')
  const data: any = {}
  if (formData.get('name')) data.name = formData.get('name')?.toString()
  if (formData.get('color_theme')) data.color_theme = formData.get('color_theme')?.toString()
  if (formData.get('icon_url')) data.icon_url = formData.get('icon_url')?.toString()

  const updated = await prisma.course.update({ where: { id }, data })
  return updated
}

export async function deleteCourse(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')

  const deleted = await prisma.course.delete({ where: { id } })
  return deleted
}

// Nodes (RoadmapNode)
export async function createNode(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const courseId = formData.get('courseId')?.toString()
  const title = formData.get('title')?.toString() || ''
  const order_index = parseInt(formData.get('order_index')?.toString() || '0', 10)
  const difficulty_level = (formData.get('difficulty_level')?.toString() || 'BEGINNER') as any
  const is_boss_level = formData.get('is_boss_level')?.toString() === 'on'

  if (!courseId) throw new Error('Missing courseId')

  const node = await prisma.roadmapNode.create({ data: { courseId, title, order_index, difficulty_level, is_boss_level } })
  return node
}

export async function updateNode(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')
  const data: any = {}
  if (formData.get('title')) data.title = formData.get('title')?.toString()
  if (formData.get('order_index')) data.order_index = parseInt(formData.get('order_index')?.toString() || '0', 10)
  if (formData.get('difficulty_level')) data.difficulty_level = formData.get('difficulty_level')?.toString()
  data.is_boss_level = formData.get('is_boss_level')?.toString() === 'on'

  const updated = await prisma.roadmapNode.update({ where: { id }, data })
  return updated
}

export async function deleteNode(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')

  const deleted = await prisma.roadmapNode.delete({ where: { id } })
  return deleted
}

// Questions
export async function createQuestion(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const nodeId = formData.get('nodeId')?.toString()
  const question_text = formData.get('question_text')?.toString() || ''
  const explanation_text = formData.get('explanation_text')?.toString() || null
  const difficulty = (formData.get('difficulty')?.toString() || 'BEGINNER') as any
  const question_type = (formData.get('question_type')?.toString() || 'MULTIPLE_CHOICE') as any

  if (!nodeId) throw new Error('Missing nodeId')

  const q = await prisma.question.create({ data: { nodeId, question_text, explanation_text, difficulty, question_type } })
  return q
}

export async function updateQuestion(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')
  const data: any = {}
  if (formData.get('question_text')) data.question_text = formData.get('question_text')?.toString()
  if (formData.get('explanation_text')) data.explanation_text = formData.get('explanation_text')?.toString()
  if (formData.get('difficulty')) data.difficulty = formData.get('difficulty')?.toString()
  if (formData.get('question_type')) data.question_type = formData.get('question_type')?.toString()

  const updated = await prisma.question.update({ where: { id }, data })
  return updated
}

export async function deleteQuestion(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')

  const deleted = await prisma.question.delete({ where: { id } })
  return deleted
}

// Answers
export async function createAnswer(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const questionId = formData.get('questionId')?.toString()
  const answer_text = formData.get('answer_text')?.toString() || ''
  const is_correct = formData.get('is_correct')?.toString() === 'on'

  if (!questionId) throw new Error('Missing questionId')

  const a = await prisma.answer.create({ data: { questionId, answer_text, is_correct } })
  return a
}

export async function updateAnswer(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')
  const data: any = {}
  if (formData.get('answer_text')) data.answer_text = formData.get('answer_text')?.toString()
  data.is_correct = formData.get('is_correct')?.toString() === 'on'

  const updated = await prisma.answer.update({ where: { id }, data })
  return updated
}

export async function deleteAnswer(formData: FormData) {
  'use server'
  const req = new Request('http://localhost', { headers: headers() as Headers })
  const maybeErr = requireAdminOrThrow(req)
  if (maybeErr) throw new Error('Unauthorized')

  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing id')

  const deleted = await prisma.answer.delete({ where: { id } })
  return deleted
}

