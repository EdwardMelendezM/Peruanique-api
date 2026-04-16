import React from 'react'
import { prisma } from '@/libs/prisma'
import { updateQuestionAction } from '@/features/admin/actions/admin-actions'

type Props = { params: { id: string } }

export default async function EditQuestionPage({ params }: Props) {
  const question = await prisma.question.findUnique({ where: { id: params.id } })
  if (!question) return <div>Question not found</div>

  return (
    <div>
      <h1>Edit Question</h1>
      <form action={updateQuestionAction} method="post">
        <input type="hidden" name="id" value={question.id} />
        <div>
          <label htmlFor="question_text">Question text</label>
          <textarea id="question_text" name="question_text" defaultValue={question.question_text} />
        </div>
        <div>
          <label htmlFor="explanation_text">Explanation</label>
          <textarea id="explanation_text" name="explanation_text" defaultValue={question.explanation_text ?? ''} />
        </div>
        <div>
          <button type="submit">Update Question</button>
        </div>
      </form>
    </div>
  )
}

