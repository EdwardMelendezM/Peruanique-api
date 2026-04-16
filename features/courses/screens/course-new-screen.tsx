'use client'

import CourseForm from '@/features/courses/components/course-form'

export default function CoursesNewScreen() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
        <p className="text-gray-600 mt-2">Añade un nuevo curso al catálogo</p>
      </div>
      <CourseForm />
    </div>
  )
}

