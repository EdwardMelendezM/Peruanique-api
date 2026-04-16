import { prisma } from '@/lib/prisma'
import LessonListScreen from '@/features/lessons/screens/lesson-list-screen';

interface LessonsPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function LessonsPage({ params }: LessonsPageProps) {
  const { courseId } = await params;
  const lessons = await prisma.roadmapNode.findMany({
    where: { courseId: courseId },
    orderBy: { order_index: 'asc' },
  })

  return <LessonListScreen courseId={courseId} lessons={lessons} />
}

