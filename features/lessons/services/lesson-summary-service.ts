import { prisma } from '@/lib/prisma';

/**
 * Service for fetching lesson summaries with comprehensive data.
 * Provides complete lesson content including all questions and answers,
 * and optionally user progress and attempt history.
 */
export const LessonSummaryService = {
  /**
   * Fetches complete lesson summary with all questions and their answers.
   * Used for displaying a comprehensive view of lesson content.
   *
   * @param lessonId - UUID of the RoadmapNode (lesson)
   * @returns Complete lesson data with questions and answers, or null if not found
   */
  async getLessonSummary(lessonId: string) {
    return await prisma.roadmapNode.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
        questions: {
          include: {
            answers: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  /**
   * Get lesson summary with user's progress and attempts
   */
  async getLessonSummaryWithUserProgress(lessonId: string, userId: string) {
    const lesson = await this.getLessonSummary(lessonId);

    if (!lesson) return null;

    // Fetch user's attempts for this lesson
    const attempts = await prisma.lessonAttempt.findMany({
      where: {
        userId,
        nodeId: lessonId,
      },
      include: {
        selectedAnswer: true,
        question: true,
      },
      orderBy: { answered_at: 'desc' },
    });

    // Calculate statistics
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.is_correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    return {
      lesson,
      userStats: {
        totalAttempts,
        correctAttempts,
        accuracy,
      },
      userAttempts: attempts,
    };
  },
};

