import { prisma } from '@/lib/prisma';
import { RoadmapNodeService } from '@/features/roadmap-nodes/services/roadmap-node-services';
import type { Prisma } from '@/app/generated/prisma/client';

export const LessonService = {
  async getNextQuestionForLesson(lessonId: string, _userId?: string) {
    const node = await RoadmapNodeService.getRoadmapNodeWithQuestions(lessonId);
    if (!node) return null;

    // keep reference to _userId to avoid linter unused variable
    void _userId;

    // Simple strategy: return the first question of the node
    const q = node.questions as unknown as unknown[] | undefined;
    return q && q.length > 0 ? (q[0] as unknown) : null;
  },

  async submitAnswer(opts: { userId: string; lessonId: string; questionId: string; selectedAnswerId?: string; timeSpentSeconds?: number }) {
    const { userId, questionId, selectedAnswerId, timeSpentSeconds } = opts as { userId: string; questionId: string; selectedAnswerId?: string; timeSpentSeconds?: number };

    // Load question with answers and node
    const question = await prisma.question.findUnique({ where: { id: questionId }, include: { answers: true, node: true } });
    if (!question) throw new Error('Question not found');

    const selected = selectedAnswerId ? question.answers.find(a => a.id === selectedAnswerId) : undefined;
    const correct = question.answers.find(a => a.is_correct);
    const isCorrect = !!selected && selected.is_correct;

    // Create attempt
    const attempt = await prisma.lessonAttempt.create({
      data: {
        userId,
        nodeId: question.nodeId,
        questionId,
        selectedAnswerId: selectedAnswerId ?? null,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds ?? null
      }
    });

    let xpDelta = 0;
    let coinsDelta = 0;

    // Update progress and rewards only if correct and wasn't already completed
    const existingProgress = await prisma.userProgress.findUnique({ where: { userId_nodeId: { userId, nodeId: question.nodeId } } }).catch(() => null);

    const alreadyCompleted = existingProgress?.status === 'COMPLETED';

    if (isCorrect && !alreadyCompleted) {
      // mark progress as completed or create
      if (existingProgress) {
        // increment score_obtained by 1 and set status to COMPLETED
        await prisma.userProgress.update({ where: { id: existingProgress.id }, data: { status: 'COMPLETED', score_obtained: existingProgress.score_obtained + 1 } as Prisma.UserProgressUpdateInput });
      } else {
        await prisma.userProgress.create({ data: { userId, nodeId: question.nodeId, status: 'COMPLETED', score_obtained: 1 } });
      }

      // XP rules
      xpDelta = 10;
      if (question.node?.is_boss_level) xpDelta += 50;

      coinsDelta = 1;

      // update user totals
      await prisma.user.update({ where: { id: userId }, data: { total_xp: { increment: xpDelta }, streak_days: { increment: 1 } } as Prisma.UserUpdateInput });

      // create reward event
      await prisma.rewardEvent.create({ data: { userId, type: 'correct_answer', points_delta: xpDelta, coins_delta: coinsDelta, meta: {} } });
    }

    return {
      attemptId: attempt.id,
      isCorrect,
      correctAnswerId: correct?.id ?? null,
      xpDelta,
      coinsDelta,
      showInsight: !isCorrect
    };
  }
};

