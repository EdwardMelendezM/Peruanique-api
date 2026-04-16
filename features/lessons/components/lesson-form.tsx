'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RoadmapNode } from '@/app/generated/prisma/client'
import { createLessonAction, updateLessonAction } from '@/features/lessons/actions/lesson-actions'
import { CreateLessonDTO } from '@/features/lessons/dtos/create-lesson.dto'
import { UpdateLessonDTO } from '@/features/lessons/dtos/update-lesson.dto'

type LessonFormProps = {
  courseId: string
  lesson?: RoadmapNode
}

export default function LessonForm({ courseId, lesson }: LessonFormProps) {
  const router = useRouter()
  const isNew = !lesson
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = isNew
        ? await createLessonAction({
            courseId,
            title: formData.get('title')?.toString() || '',
            order_index: parseInt(formData.get('order_index')?.toString() || '0'),
            difficulty_level: (formData.get('difficulty_level') || 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL',
            is_published: formData.get('is_published')?.toString() === 'on',
          } as CreateLessonDTO)
        : await updateLessonAction({
            id: lesson?.id || '',
            title: formData.get('title')?.toString() || '',
            order_index: parseInt(formData.get('order_index')?.toString() || '0'),
            difficulty_level: (formData.get('difficulty_level') || 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL',
            is_published: formData.get('is_published')?.toString() === 'on',
          } as UpdateLessonDTO)

      if (!result.success) {
        if (result.fieldErrors) {
          const fieldErrors: Record<string, string> = {}
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value) ? value[0] : value
          })
          setErrors(fieldErrors)
        }
        return
      }

      router.push(`/admin/courses/${courseId}/lessons`)
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      setErrors({ submit: 'Error al guardar la lección' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Crear Lección' : 'Editar Lección'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Configura los detalles de la lección académica
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título de la Lección
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={lesson?.title ?? ''}
            placeholder="ej: Introducción a Álgebra"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="order_index" className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              id="order_index"
              name="order_index"
              type="number"
              required
              defaultValue={lesson?.order_index ?? 0}
              className={`w-full px-4 py-2 border rounded-lg ${errors.order_index ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.order_index && <p className="text-red-600 text-sm mt-1">{errors.order_index}</p>}
          </div>

          <div>
            <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de Dificultad
            </label>
            <select
              id="difficulty_level"
              name="difficulty_level"
              defaultValue={lesson?.difficulty_level ?? 'BEGINNER'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
              <option value="PROFESSIONAL">Profesional</option>
            </select>
          </div>
        </div>

        <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded">
          <input
            id="is_published"
            name="is_published"
            type="checkbox"
            defaultChecked={lesson?.is_boss_level ?? false}
            className="h-4 w-4 rounded border-blue-300"
          />
          <label htmlFor="is_published" className="ml-3 text-sm font-medium text-blue-900">
            Publicar esta lección (visible para estudiantes)
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Guardando...' : isNew ? 'Crear Lección' : 'Actualizar Lección'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 px-4 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

