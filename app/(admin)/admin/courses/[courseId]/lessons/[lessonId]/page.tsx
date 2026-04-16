import { prisma } from '@/lib/prisma'
import LessonEditScreen from '@/features/lessons/screens/lesson-edit-screen';

interface EditLessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>
}

export default async function EditLessonPage({
  params,
}:EditLessonPageProps) {
  const { courseId, lessonId } = await params;
  const lesson = await prisma.roadmapNode.findUnique({
    where: { id: lessonId },
  })

  if (!lesson) {
    return <div className="py-8 text-center text-gray-600">Lección no encontrada</div>
  }

  return <LessonEditScreen courseId={courseId} lesson={lesson} />
}

