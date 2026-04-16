import { prisma } from '@/lib/prisma'
import QuestionForm from '@/features/questions/components/question-form'

export default async function NewQuestionPage() {
  const nodes = await prisma.roadmapNode.findMany({
    include: { course: true },
    orderBy: { order_index: 'asc' }
  })

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Pregunta</h1>
        <p className="text-gray-600 mt-2">Selecciona un nodo y completa los detalles de la pregunta</p>
      </div>

      {nodes.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          <p>No hay nodos disponibles. Por favor, crea un nodo primero.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Nota:</span> Selecciona el nodo al que pertenecerá esta pregunta
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="nodeId" className="block text-sm font-medium text-gray-700 mb-1">
                Nodo <span className="text-red-600">*</span>
              </label>
              <select
                id="nodeId"
                name="nodeId"
                defaultValue=""
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Selecciona un nodo --</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.course?.name} → {n.title}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Dynamically load the question form based on selected node */}
          <div id="question-form-container" className="mt-8">
            <QuestionForm nodeId={nodes[0]?.id || ''} />
          </div>
        </div>
      )}
    </div>
  )
}

