import { LessonSummaryService } from '@/features/lessons/services/lesson-summary-service';
import { LessonSummary } from '@/features/lessons/components/lesson-summary';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface LessonSummaryPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function LessonSummaryPage({
  params,
}: LessonSummaryPageProps) {
  const { id } = await params;
  const lesson = await LessonSummaryService.getLessonSummary(id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Link
            href={`/admin/courses/${lesson.courseId}/lessons`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Lecciones
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <LessonSummary lesson={lesson} />
      </div>
    </div>
  );
}

