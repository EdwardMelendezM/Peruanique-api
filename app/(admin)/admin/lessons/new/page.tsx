import { prisma } from '@/lib/prisma'
import LessonForm from '@/features/lessons/components/lesson-form'

export default async function NewLessonPage() {
  const courses = await prisma.course.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Lección</h1>
        <p className="text-gray-600 mt-2">Selecciona un curso y completa los detalles de la lección</p>
      </div>

      {courses.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          <p>No hay cursos disponibles. Por favor, crea un curso primero.</p>
        </div>
      ) : (
        <LessonForm courseId={courses[0]?.id || ''} />
      )}
    </div>
  )
}

