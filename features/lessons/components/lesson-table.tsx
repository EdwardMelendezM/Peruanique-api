'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react'
import { RoadmapNode } from '@/app/generated/prisma/client'
import { deleteLessonAction, togglePublishLessonAction } from '@/features/lessons/actions/lesson-actions'

type LessonTableProps = {
  courseId: string
  lessons: RoadmapNode[]
}

export default function LessonTable({ courseId, lessons }: LessonTableProps) {
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

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay lecciones aún. Crea una nueva.</p>
        <Link href={`/admin/courses/${courseId}/lessons/new`} className="text-blue-600 hover:underline mt-2 inline-block">
          Crear primera lección →
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Orden</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dificultad</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{lesson.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{lesson.order_index}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    lesson.difficulty_level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                    lesson.difficulty_level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                    lesson.difficulty_level === 'ADVANCED' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lesson.difficulty_level}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleTogglePublish(lesson)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 text-sm font-medium disabled:opacity-50"
                  >
                    {lesson.is_boss_level ? (
                      <>
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600">Publicada</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Oculta</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/admin/lessons/${lesson.id}/summary`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Ver resumen"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(lesson.id)}
                      disabled={isPending}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Eliminar lección?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Se eliminarán todas las preguntas asociadas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 font-semibold rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirmDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

