'use client'

import LessonForm from '@/features/lessons/components/lesson-form'

type LessonNewScreenProps = {
  courseId: string
}

export default function LessonNewScreen({ courseId }: LessonNewScreenProps) {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Lección</h1>
        <p className="text-gray-600 mt-2">Añade una nueva lección al curso</p>
      </div>
      <LessonForm courseId={courseId} />
    </div>
  )
}

