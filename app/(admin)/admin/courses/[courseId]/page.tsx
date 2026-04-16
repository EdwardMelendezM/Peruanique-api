import { prisma } from '@/lib/prisma'
import CourseForm from '@/features/courses/components/course-form'

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
  })

  if (!course) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Curso no encontrado</h1>
        <p className="text-gray-600 mt-2">El curso que buscas no existe o fue eliminado</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
        <p className="text-gray-600 mt-2">Modifica los detalles del curso</p>
      </div>
      <CourseForm course={course} />
    </div>
  )
}

