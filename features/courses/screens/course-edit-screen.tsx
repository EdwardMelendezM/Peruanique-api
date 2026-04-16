'use client'

import { Course } from '@/app/generated/prisma/client'
import CourseForm from '@/features/courses/components/course-form'

type CourseEditScreenProps = {
  course: Course
}

export default function CourseEditScreen({ course }: CourseEditScreenProps) {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
        <p className="text-gray-600 mt-2">{course.name}</p>
      </div>
      <CourseForm course={course} />
    </div>
  )
}

