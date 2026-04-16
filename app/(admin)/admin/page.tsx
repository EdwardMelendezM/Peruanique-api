import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, Code2, FileQuestion, CheckCircle2, Plus } from 'lucide-react'

export default async function AdminPage() {
  const [coursesCount, , lessonsCount, questionsCount, answersCount] = await Promise.all([
    prisma.course.count(),
    prisma.roadmapNode.count({ where: { is_boss_level: true } }),
    prisma.roadmapNode.count({ where: { is_boss_level: false } }),
    prisma.question.count(),
    prisma.answer.count(),
  ])

  const stats = [
    {
      label: 'Cursos',
      value: coursesCount,
      icon: BookOpen,
      href: '/admin/courses',
      color: 'blue',
    },
    {
      label: 'Lecciones',
      value: lessonsCount,
      icon: Code2,
      href: '/admin/lessons',
      color: 'purple',
    },
    {
      label: 'Preguntas',
      value: questionsCount,
      icon: FileQuestion,
      href: '/admin/questions',
      color: 'amber',
    },
    {
      label: 'Respuestas',
      value: answersCount,
      icon: CheckCircle2,
      href: '/admin/answers',
      color: 'green',
    },
  ]

  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Gestiona todos los contenidos de la plataforma FIJA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-50 border-blue-200',
            purple: 'bg-purple-50 border-purple-200',
            amber: 'bg-amber-50 border-amber-200',
            green: 'bg-green-50 border-green-200',
          }
          const colorText = {
            blue: 'text-blue-600',
            purple: 'text-purple-600',
            amber: 'text-amber-600',
            green: 'text-green-600',
          }

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`p-6 border rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-10 h-10 ${colorText[stat.color as keyof typeof colorText]}`} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Crear Curso</span>
          </Link>
          <Link
            href="/admin/lessons/new"
            className="flex items-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Crear Lección</span>
          </Link>
          <Link
            href="/admin/questions/new"
            className="flex items-center gap-3 p-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Crear Pregunta</span>
          </Link>
        </div>
      </div>

      {/* Features Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Courses Module */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Cursos</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Crea y gestiona cursos que agrupan lecciones y nodos de aprendizaje
            </p>
            <Link
              href="/admin/courses"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Ir a Cursos →
            </Link>
          </div>

          {/* Lessons Module */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Lecciones</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Organiza lecciones con preguntas y respuestas para cada curso
            </p>
            <Link
              href="/admin/lessons"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Ir a Lecciones →
            </Link>
          </div>

          {/* Questions Module */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FileQuestion className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Crea preguntas con múltiples opciones para cada lección
            </p>
            <Link
              href="/admin/questions"
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              Ir a Preguntas →
            </Link>
          </div>

          {/* Answers Module */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Respuestas</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Define opciones correctas e incorrectas para cada pregunta
            </p>
            <Link
              href="/admin/answers"
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Ir a Respuestas →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900 text-sm">
          <strong>💡 Estructura Jerárquica:</strong> Curso → Lecciones → Nodos → Preguntas → Respuestas.
          Comienza creando un curso, luego agrega lecciones con su contenido.
        </p>
      </div>
    </div>
  )
}


