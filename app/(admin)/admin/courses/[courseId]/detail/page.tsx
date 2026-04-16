import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CourseDetailPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      nodes: {
        orderBy: { order_index: 'asc' },
        select: { id: true, title: true, order_index: true, difficulty_level: true },
      },
    },
  })

  if (!course) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Curso no encontrado</h1>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Header con navegación */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
        </div>
        <Link
          href={`/admin/courses/${courseId}`}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Editar Curso
        </Link>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Lecciones</p>
          <p className="text-2xl font-bold text-gray-900">{course.nodes.length}</p>
        </div>
        {course.color_theme && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Color Tema</p>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: course.color_theme }}
              />
              <p className="text-sm font-mono">{course.color_theme}</p>
            </div>
          </div>
        )}
        {course.icon_url && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Ícono</p>
            <Image src={course.icon_url} alt="icon" width={32} height={32} className="mt-2" />
          </div>
        )}
      </div>

      {/* Lecciones */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lecciones</h2>
          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nueva Lección
          </Link>
        </div>

        {course.nodes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No hay lecciones aún en este curso</p>
            <Link
              href={`/admin/courses/${courseId}/lessons/new`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Crear primera lección →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {course.nodes.map((node) => (
              <Link
                key={node.id}
                href={`/admin/courses/${courseId}/lessons/${node.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{node.title}</p>
                    <p className="text-sm text-gray-600 mt-1">Orden: {node.order_index}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    node.difficulty_level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                    node.difficulty_level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                    node.difficulty_level === 'ADVANCED' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {node.difficulty_level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

