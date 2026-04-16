import LessonNewScreen from '@/features/lessons/screens/lesson-new-screen'

interface NewLessonPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function NewLessonPage({ params }:NewLessonPageProps) {
  const { courseId } = await params;
  return <LessonNewScreen courseId={courseId} />
}

