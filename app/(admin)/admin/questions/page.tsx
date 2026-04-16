import { prisma } from '@/lib/prisma'
import QuestionListScreen from '@/features/questions/screens/question-list-screen'

export default async function QuestionsPage() {
  const questions = await prisma.question.findMany({
    include: { node: { include: { course: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return <QuestionListScreen questions={questions} />
}

