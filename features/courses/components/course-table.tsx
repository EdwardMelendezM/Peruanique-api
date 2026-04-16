'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { Course } from '@/app/generated/prisma/client'
import { deleteCourseAction } from '@/features/courses/actions/course-actions'

type CourseTableProps = {
  courses: Course[]
}

export default function CourseTable({ courses }: CourseTableProps) {
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
        const result = await deleteCourseAction(deleteId)
        if (!result.success) {
          console.error(result.error || 'Error desconocido')
          return
        }
        setDeleteId(null)
        setIsDeleteModalOpen(false)
        router.refresh()
      } catch (err: unknown) {
        const error = err as { message?: string }
        console.error(error.message || 'Error al eliminar el curso')
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el curso de nuestros servidores.
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Color</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ícono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-32 text-center text-gray-500">
                  No hay cursos registrados.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 text-gray-700">{course.color_theme ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {course.icon_url ? (
                      <a href={course.icon_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Ver ícono
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                   <td className="px-6 py-4">
                     <div className="flex gap-2">
                       <Link
                         href={`/admin/courses/${course.id}/detail`}
                         className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                         title="Ver detalles"
                       >
                         Lecciones
                       </Link>
                       <Link
                         href={`/admin/courses/${course.id}`}
                         className="p-2 hover:bg-gray-200 rounded transition"
                         title="Editar"
                       >
                         <Pencil className="h-4 w-4" />
                       </Link>
                       <button
                         onClick={() => handleDeleteClick(course.id)}
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

