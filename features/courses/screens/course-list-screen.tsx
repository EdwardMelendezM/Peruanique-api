'use client'

import Link from 'next/link'
import { Course } from '@/app/generated/prisma/client'
import CourseTable from '@/features/courses/components/course-table'

type CoursesListScreenProps = {
  courses: Course[]
}

export default function CoursesListScreen({ courses }: CoursesListScreenProps) {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-2">Administra el catálogo de cursos disponibles</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + Crear Curso
        </Link>
      </div>
      <CourseTable courses={courses} />
    </div>
  )
}

