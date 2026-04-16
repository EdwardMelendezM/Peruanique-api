import { prisma } from '@/lib/prisma'
import QuestionForm from '@/features/questions/components/question-form'

type Props = { params: { id: string } }

export default async function EditQuestionPage({ params }: Props) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: { node: { include: { course: true } } }
  })

  if (!question) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pregunta no encontrada</h1>
        <p className="text-gray-600 mt-2">La pregunta que buscas no existe o fue eliminada</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Pregunta</h1>
        <p className="text-gray-600 mt-2">
          Nodo: <span className="font-semibold">{question.node?.title}</span> •
          Curso: <span className="font-semibold">{question.node?.course?.name}</span>
        </p>
      </div>
      <QuestionForm nodeId={question.nodeId} question={question} />
    </div>
  )
}

