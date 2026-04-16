'use client';

import type { RoadmapNode, Question, Answer } from '@/app/generated/prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface LessonSummaryProps {
  lesson: RoadmapNode & {
    course: { id: string; name: string };
    questions: (Question & {
      answers: Answer[];
    })[];
  };
  userStats?: {
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
  };
}

export function LessonSummary({ lesson, userStats }: LessonSummaryProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800';
      case 'PROFESSIONAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {lesson.course.name}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className={getDifficultyColor(lesson.difficulty_level)}>
            {getDifficultyLabel(lesson.difficulty_level)}
          </Badge>
          {lesson.is_boss_level && (
            <Badge variant="destructive">Boss Level</Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {lesson.questions.length} pregunta{lesson.questions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* User Stats (if available) */}
      {userStats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {userStats.totalAttempts}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Intentos
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userStats.correctAttempts}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Correctas
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.accuracy}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Precisión
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {lesson.questions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">
                  No hay preguntas en esta lección aún
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          lesson.questions.map((question: Question & { answers: Answer[] }, qIndex: number) => (
            <Card key={question.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      Pregunta {qIndex + 1}
                    </CardTitle>
                    <p className="text-sm font-normal text-foreground mt-2 whitespace-pre-wrap">
                      {question.question_text}
                    </p>
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                {/* Answers */}
                <div className="space-y-2">
                  {question.answers.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Sin opciones de respuesta
                    </p>
                  ) : (
                    question.answers.map((answer: Answer, aIndex: number) => (
                      <div
                        key={answer.id}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          answer.is_correct
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 font-semibold text-sm flex-shrink-0">
                            {String.fromCharCode(65 + aIndex)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground break-words">
                              {answer.answer_text}
                            </p>
                          </div>
                          {answer.is_correct && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Explanation */}
                {question.explanation_text && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 rounded">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase mb-1">
                      Explicación
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-100 whitespace-pre-wrap">
                      {question.explanation_text}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

