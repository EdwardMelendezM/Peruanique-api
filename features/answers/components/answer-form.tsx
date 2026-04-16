'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Answer } from '@/app/generated/prisma/client'
import { createAnswerAction, updateAnswerAction } from '@/features/answers/actions/answer-actions'
import { CreateAnswerDTO } from '@/features/answers/dtos/create-answer.dto'
import { UpdateAnswerDTO } from '@/features/answers/dtos/update-answer.dto'

type AnswerFormProps = {
  questionId: string
  answer?: Answer
}

export default function AnswerForm({ questionId, answer }: AnswerFormProps) {
  const router = useRouter()
  const isNew = !answer
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = isNew
        ? await createAnswerAction({
            questionId,
            answer_text: formData.get('answer_text')?.toString() || '',
            is_correct: formData.get('is_correct')?.toString() === 'on',
          } as CreateAnswerDTO)
        : await updateAnswerAction({
            id: answer?.id || '',
            questionId,
            answer_text: formData.get('answer_text')?.toString() || '',
            is_correct: formData.get('is_correct')?.toString() === 'on',
          } as UpdateAnswerDTO)

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
      setErrors({ submit: 'Error al guardar la respuesta' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isNew ? 'Crear Respuesta' : 'Editar Respuesta'}
      </h2>

      <form action={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <div>
          <label htmlFor="answer_text" className="block text-sm font-medium text-gray-700 mb-1">
            Respuesta
          </label>
          <textarea
            id="answer_text"
            name="answer_text"
            required
            rows={3}
            defaultValue={answer?.answer_text ?? ''}
            className={`w-full px-4 py-2 border rounded-lg ${errors.answer_text ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.answer_text && <p className="text-red-600 text-sm mt-1">{errors.answer_text}</p>}
        </div>

        <div className="flex items-center">
          <input
            id="is_correct"
            name="is_correct"
            type="checkbox"
            defaultChecked={answer?.is_correct ?? false}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="is_correct" className="ml-2 text-sm font-medium text-gray-700">
            Es la respuesta correcta
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : isNew ? 'Crear Respuesta' : 'Actualizar Respuesta'}
        </button>
      </form>
    </div>
  )
}

