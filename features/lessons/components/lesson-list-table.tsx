'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { RoadmapNode, Course } from '@/app/generated/prisma/client'
import { deleteLessonAction, togglePublishLessonAction } from '@/features/lessons/actions/lesson-actions'

type LessonListTableProps = {
  lessons: (RoadmapNode & {
    course?: Course
  })[]
}

const getDifficultyBadgeColor = (difficulty: string) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'bg-green-100 text-green-800'
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800'
    case 'ADVANCED':
      return 'bg-orange-100 text-orange-800'
    case 'PROFESSIONAL':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function LessonListTable({ lessons }: LessonListTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setIsDeleteModalOpen(true)
  }

  const onConfirmDelete = () => {
    if (!deleteId) return

    startTransition(async () => {
      try {
        const result = await deleteLessonAction(deleteId)
        if (!result.success) {
          console.error(result.error || 'Error desconocido')
          return
        }
        setDeleteId(null)
        setIsDeleteModalOpen(false)
        router.refresh()
      } catch (err: unknown) {
        const error = err as { message?: string }
        console.error(error.message || 'Error al eliminar la lección')
      }
    })
  }

  const handleTogglePublish = (lesson: RoadmapNode) => {
    startTransition(async () => {
      try {
        const result = await togglePublishLessonAction(lesson.id, !lesson.is_boss_level)
        if (!result.success) {
          console.error(result.error || 'Error desconocido')
          return
        }
        router.refresh()
      } catch (err: unknown) {
        const error = err as { message?: string }
        console.error(error.message || 'Error al cambiar estado de publicación')
      }
    })
  }

  return (
    <>
      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-bold mb-4">¿Estás completamente seguro?</h2>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Se eliminará permanentemente la lección de nuestros servidores.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lección</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Curso</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Orden</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dificultad</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-32 text-center text-gray-500">
                  No hay lecciones registradas.
                </td>
              </tr>
            ) : (
              lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{lesson.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lesson.course?.name ?? '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                      {lesson.order_index}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getDifficultyBadgeColor(lesson.difficulty_level)}`}>
                      {lesson.difficulty_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleTogglePublish(lesson)}
                      disabled={isPending}
                      className="p-2 hover:bg-gray-200 rounded transition disabled:opacity-50"
                      title={lesson.is_boss_level ? 'Despublicar' : 'Publicar'}
                    >
                      {lesson.is_boss_level ? (
                        <Eye className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-400 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="p-2 hover:bg-gray-200 rounded transition"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(lesson.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

