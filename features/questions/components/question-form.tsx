'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Question } from '@/app/generated/prisma/client'
import { createQuestionAction, updateQuestionAction } from '@/features/questions/actions/question-actions'
import { CreateQuestionDTO } from '@/features/questions/dtos/create-question.dto'
import { UpdateQuestionDTO } from '@/features/questions/dtos/update-question.dto'

type QuestionFormProps = {
  nodeId: string
  question?: Question
}

export default function QuestionForm({ nodeId, question }: QuestionFormProps) {
  const router = useRouter()
  const isNew = !question
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = isNew
        ? await createQuestionAction({
            nodeId,
            question_text: formData.get('question_text')?.toString() || '',
            explanation_text: formData.get('explanation_text')?.toString() || '',
            difficulty: (formData.get('difficulty') || 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL',
            question_type: (formData.get('question_type') || 'MULTIPLE_CHOICE') as 'MULTIPLE_CHOICE' | 'DRAG_AND_DROP',
          } as CreateQuestionDTO)
        : await updateQuestionAction({
            id: question?.id || '',
            question_text: formData.get('question_text')?.toString() || '',
            explanation_text: formData.get('explanation_text')?.toString() || '',
            difficulty: (formData.get('difficulty') || 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL',
            question_type: (formData.get('question_type') || 'MULTIPLE_CHOICE') as 'MULTIPLE_CHOICE' | 'DRAG_AND_DROP',
          } as UpdateQuestionDTO)

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

      router.back()
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      setErrors({ submit: 'Error al guardar la pregunta' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isNew ? 'Crear Pregunta' : 'Editar Pregunta'}
      </h2>

      <form action={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <div>
          <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 mb-1">
            Pregunta
          </label>
          <textarea
            id="question_text"
            name="question_text"
            required
            rows={4}
            defaultValue={question?.question_text ?? ''}
            className={`w-full px-4 py-2 border rounded-lg ${errors.question_text ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.question_text && <p className="text-red-600 text-sm mt-1">{errors.question_text}</p>}
        </div>

        <div>
          <label htmlFor="explanation_text" className="block text-sm font-medium text-gray-700 mb-1">
            Explicación (opcional)
          </label>
          <textarea
            id="explanation_text"
            name="explanation_text"
            rows={3}
            defaultValue={question?.explanation_text ?? ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Dificultad
            </label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={question?.difficulty ?? 'BEGINNER'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
              <option value="PROFESSIONAL">Profesional</option>
            </select>
          </div>

          <div>
            <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="question_type"
              name="question_type"
              defaultValue={question?.question_type ?? 'MULTIPLE_CHOICE'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="MULTIPLE_CHOICE">Opción Múltiple</option>
              <option value="DRAG_AND_DROP">Arrastra y Suelta</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : isNew ? 'Crear Pregunta' : 'Actualizar Pregunta'}
        </button>
      </form>
    </div>
  )
}


