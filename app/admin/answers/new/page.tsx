import React from 'react'
import { prisma } from '@/libs/prisma'
import { createAnswerAction } from '@/features/admin/actions/admin-actions'

export default async function NewAnswerPage() {
  const questions = await prisma.question.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>New Answer</h1>
      <form action={createAnswerAction} method="post">
        <div>
          <label htmlFor="questionId">Question</label>
          <select id="questionId" name="questionId">
            {questions.map((q) => (
              <option key={q.id} value={q.id}>{q.question_text.slice(0, 80)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="answer_text">Answer text</label>
          <textarea id="answer_text" name="answer_text" />
        </div>
        <div>
          <label>
            <input type="checkbox" name="is_correct" /> Correct
          </label>
        </div>
        <div>
          <button type="submit">Create Answer</button>
        </div>
      </form>
    </div>
  )
}

