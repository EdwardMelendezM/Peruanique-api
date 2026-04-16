'use client'

import Link from 'next/link'
import { Answer, Question, RoadmapNode } from '@/app/generated/prisma/client'
import AnswerTable from '@/features/answers/components/answer-table'

type AnswerListScreenProps = {
  answers: (Answer & {
    question?: Question & {
      node?: RoadmapNode
    }
  })[]
}

export default function AnswerListScreen({ answers }: AnswerListScreenProps) {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Respuestas</h1>
          <p className="text-gray-600 mt-2">Administra todas las opciones de respuesta para las preguntas</p>
        </div>
        <Link
          href="/admin/answers/new"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + Crear Respuesta
        </Link>
      </div>
      <AnswerTable answers={answers} />
    </div>
  )
}

