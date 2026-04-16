'use client'

import { RoadmapNode } from '@/app/generated/prisma/client'
import LessonForm from '@/features/lessons/components/lesson-form'

type LessonEditScreenProps = {
  courseId: string
  lesson: RoadmapNode
}

export default function LessonEditScreen({ courseId, lesson }: LessonEditScreenProps) {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Lección</h1>
        <p className="text-gray-600 mt-2">Modifica los detalles de la lección</p>
      </div>
      <LessonForm courseId={courseId} lesson={lesson} />
    </div>
  )
}

