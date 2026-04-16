import { prisma } from '@/lib/prisma'
import AnswerForm from '@/features/answers/components/answer-form'

export default async function NewAnswerPage() {
  const questions = await prisma.question.findMany({
    include: { node: { include: { course: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Respuesta</h1>
        <p className="text-gray-600 mt-2">Selecciona una pregunta y completa los detalles de la respuesta</p>
      </div>

      {questions.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          <p>No hay preguntas disponibles. Por favor, crea una pregunta primero.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Nota:</span> Selecciona la pregunta a la que pertenecerá esta respuesta
            </p>
          </div>

          <form className="space-y-6 mb-8">
            <div>
              <label htmlFor="questionId" className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta <span className="text-red-600">*</span>
              </label>
              <select
                id="questionId"
                name="questionId"
                defaultValue=""
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Selecciona una pregunta --</option>
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.node?.course?.name} → {q.node?.title} → {q.question_text.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          </form>

          <AnswerForm questionId={questions[0]?.id || ''} />
        </div>
      )}
    </div>
  )
}

