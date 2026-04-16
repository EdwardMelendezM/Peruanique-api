import { prisma } from '@/lib/prisma'
import LessonListScreen from '@/features/lessons/screens/lesson-list-screen'

export default async function LessonsPage() {
  const lessons = await prisma.roadmapNode.findMany({
    include: { course: true },
    orderBy: [{ courseId: 'asc' }, { order_index: 'asc' }],
  })

  return <LessonListScreen lessons={lessons} />
}

