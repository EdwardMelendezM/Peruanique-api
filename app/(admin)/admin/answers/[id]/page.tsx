import { prisma } from '@/lib/prisma'
import AnswerForm from '@/features/answers/components/answer-form'

interface EditAnswerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditAnswerPage({ params }: EditAnswerPageProps) {
  const { id } = await params;
  const answer = await prisma.answer.findUnique({
    where: { id: id },
    include: { question: { include: { node: { include: { course: true } } } } }
  })

  if (!answer) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Respuesta no encontrada</h1>
        <p className="text-gray-600 mt-2">La respuesta que buscas no existe o fue eliminada</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Respuesta</h1>
        <p className="text-gray-600 mt-2">
          Pregunta: <span className="font-semibold">{answer.question?.question_text.slice(0, 60)}...</span>
        </p>
      </div>
      <AnswerForm questionId={answer.questionId} answer={answer} />
    </div>
  )
}

