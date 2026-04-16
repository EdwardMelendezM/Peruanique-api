'use client'

import Link from 'next/link'
import { RoadmapNode, Course } from '@/app/generated/prisma/client'
import LessonTable from '@/features/lessons/components/lesson-table'
import LessonListTable from '@/features/lessons/components/lesson-list-table'

type LessonListScreenProps = {
  courseId?: string
  lessons: (RoadmapNode & {
    course?: Course
  })[]
}

export default function LessonListScreen({ courseId, lessons }: LessonListScreenProps) {
  // Global view (all courses)
  if (!courseId) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Lecciones</h1>
            <p className="text-gray-600 mt-2">Administra todas las lecciones y nodos de aprendizaje de los cursos</p>
          </div>
          <Link
            href="/admin/lessons/new"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            + Crear Lección
          </Link>
        </div>
        <LessonListTable lessons={lessons} />
      </div>
    )
  }

  // Course-scoped view
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecciones del Curso</h1>
          <p className="text-gray-600 mt-2">
            {lessons.length} lección{lessons.length !== 1 ? 'es' : ''} total
          </p>
        </div>
        <Link
          href={`/admin/courses/${courseId}/lessons/new`}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nueva Lección
        </Link>
      </div>
      <LessonTable courseId={courseId} lessons={lessons} />
    </div>
  )
}

