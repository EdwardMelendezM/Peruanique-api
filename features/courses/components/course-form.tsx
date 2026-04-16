'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Course } from '@/app/generated/prisma/client'
import { createCourseAction, updateCourseAction } from '@/features/courses/actions/course-actions'
import { CreateCourseDTO } from '@/features/courses/dtos/create-course.dto'
import { UpdateCourseDTO } from '@/features/courses/dtos/update-course.dto'

type CourseFormProps = {
  course?: Course
}

export default function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const isNew = !course
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setErrors({})

    try {
      const data = isNew
        ? {
            name: formData.get('name')?.toString() || '',
            color_theme: formData.get('color_theme')?.toString() || '',
            icon_url: formData.get('icon_url')?.toString() || '',
          } as CreateCourseDTO
        : {
            id: course?.id || '',
            name: formData.get('name')?.toString() || '',
            color_theme: formData.get('color_theme')?.toString() || '',
            icon_url: formData.get('icon_url')?.toString() || '',
          } as UpdateCourseDTO

      const result = isNew
        ? await createCourseAction(data as CreateCourseDTO)
        : await updateCourseAction(data as UpdateCourseDTO)

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

      router.push('/admin/courses')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      setErrors({ submit: 'Error al guardar el curso' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <form
        action={handleSubmit}
        className="space-y-6"
      >
        {!isNew && <input type="hidden" name="id" value={course?.id} />}

        {/* Error general */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={course?.name ?? ''}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Color Theme */}
        <div>
          <label htmlFor="color_theme" className="block text-sm font-medium text-gray-700 mb-1">
            Color (opcional)
          </label>
          <input
            id="color_theme"
            name="color_theme"
            type="text"
            defaultValue={course?.color_theme ?? ''}
            placeholder="ej: #FF5733"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.color_theme ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.color_theme && <p className="text-red-600 text-sm mt-1">{errors.color_theme}</p>}
        </div>

        {/* Icon URL */}
        <div>
          <label htmlFor="icon_url" className="block text-sm font-medium text-gray-700 mb-1">
            Ícono URL (opcional)
          </label>
          <input
            id="icon_url"
            name="icon_url"
            type="url"
            defaultValue={course?.icon_url ?? ''}
            placeholder="https://example.com/icon.png"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.icon_url ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.icon_url && <p className="text-red-600 text-sm mt-1">{errors.icon_url}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Guardando...' : isNew ? 'Crear Curso' : 'Actualizar Curso'}
        </button>
      </form>
    </div>
  )
}

