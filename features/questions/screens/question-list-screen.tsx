'use client'

import Link from 'next/link'
import { Question, RoadmapNode, Course } from '@/app/generated/prisma/client'
import QuestionTable from '@/features/questions/components/question-table'

type QuestionListScreenProps = {
  questions: (Question & {
    node?: RoadmapNode & {
      course?: Course
    }
  })[]
}

export default function QuestionListScreen({ questions }: QuestionListScreenProps) {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Preguntas</h1>
          <p className="text-gray-600 mt-2">Administra todas las preguntas de los nodos y lecciones</p>
        </div>
        <Link
          href="/admin/questions/new"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + Crear Pregunta
        </Link>
      </div>
      <QuestionTable questions={questions} />
    </div>
  )
}

