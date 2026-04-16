import { prisma } from '@/libs/prisma';
import type { GenerateInsightDTO } from '@/features/insight/dtos/generate-insight.dto';
import type { Prisma } from '@/app/generated/prisma/client';

export const InsightService = {
  async generateInsight(dto: GenerateInsightDTO) {
    // Load attempt and question
    const attempt = await prisma.lessonAttempt.findUnique({ where: { id: dto.attemptId }, include: { question: { include: { answers: true } } } });
    if (!attempt) throw new Error('Attempt not found');

    const question = attempt.question;

    // If question has an explanation_text, use it as fallback
    const baseExplanation = question?.explanation_text ?? null;

    // If attempt was correct, no insight needed
    if (attempt.is_correct) {
      const content = [{ title: 'No insight required', body: 'Answer was correct' }];
      const saved = await prisma.aiExplanation.create({ data: {
        attemptId: attempt.id,
        provider: 'mock',
        model: 'none',
        input_tokens: 0,
        output_tokens: 0,
        latency_ms: 0,
        content: content as Prisma.InputJsonValue
      } });
      return { explanation: content, savedId: saved.id };
    }

    // Build a simple structured explanation: prefer canonical explanation_text, otherwise create 2-3 steps
    let steps: Array<{ title: string; body: string }> = [];
    if (baseExplanation) {
      steps = [
        { title: 'Explicación', body: baseExplanation },
      ];
    } else if (question) {
      const correct = question.answers.find(a => a.is_correct);
      const wrong = question.answers.find(a => a.id === attempt.selectedAnswerId) ?? null;
      steps = [
        { title: 'Por qué es incorrecta la respuesta', body: wrong ? `La opción seleccionada (${wrong.answer_text}) no es correcta.` : 'La respuesta seleccionada no es correcta.' },
        { title: 'Idea clave', body: `La respuesta correcta es: ${correct?.answer_text ?? '—'}. Concéntrate en el concepto principal.` },
        { title: 'Siguiente paso', body: 'Revisa el enunciado y trata de identificar el concepto clave. Vuelve a intentar la pregunta.' }
      ];
    } else {
      steps = [{ title: 'Explicación', body: 'No se encontró información adicional sobre la pregunta.' }];
    }

    // Save AiExplanation record
    const saved = await prisma.aiExplanation.create({ data: {
      attemptId: attempt.id,
      provider: 'mock',
      model: 'template-v1',
      input_tokens: 0,
      output_tokens: 0,
      latency_ms: 0,
      content: steps as Prisma.InputJsonValue
    } });

    return { explanation: steps, savedId: saved.id };
  }
};

