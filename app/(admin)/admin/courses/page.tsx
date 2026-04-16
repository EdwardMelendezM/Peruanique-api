import { prisma } from '@/lib/prisma'
import CoursesListScreen from '@/features/courses/screens/course-list-screen'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <CoursesListScreen courses={courses} />
}

