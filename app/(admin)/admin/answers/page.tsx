import { prisma } from '@/lib/prisma'
import AnswerListScreen from '@/features/answers/screens/answer-list-screen'

export default async function AnswersPage() {
  const answers = await prisma.answer.findMany({
    include: { question: { include: { node: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return <AnswerListScreen answers={answers} />
}

