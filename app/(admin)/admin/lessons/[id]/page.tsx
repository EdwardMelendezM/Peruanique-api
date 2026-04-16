import { prisma } from '@/lib/prisma'
import LessonForm from '@/features/lessons/components/lesson-form'

interface EditLessonPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { id } = await params;
  const lesson = await prisma.roadmapNode.findUnique({
    where: { id: id },
    include: { course: true }
  })

  if (!lesson) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Lección no encontrada</h1>
        <p className="text-gray-600 mt-2">La lección que buscas no existe o fue eliminada</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Lección</h1>
        <p className="text-gray-600 mt-2">
          Curso: <span className="font-semibold">{lesson.course?.name}</span> •
          Lección: <span className="font-semibold">{lesson.title}</span>
        </p>
      </div>
      <LessonForm courseId={lesson.courseId} lesson={lesson} />
    </div>
  )
}

