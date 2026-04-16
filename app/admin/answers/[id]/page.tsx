import React from 'react'
import { prisma } from '@/libs/prisma'
import { updateAnswerAction } from '@/features/admin/actions/admin-actions'

type Props = { params: { id: string } }

export default async function EditAnswerPage({ params }: Props) {
  const answer = await prisma.answer.findUnique({ where: { id: params.id } })
  if (!answer) return <div>Answer not found</div>

  return (
    <div>
      <h1>Edit Answer</h1>
      <form action={updateAnswerAction} method="post">
        <input type="hidden" name="id" value={answer.id} />
        <div>
          <label htmlFor="answer_text">Answer text</label>
          <textarea id="answer_text" name="answer_text" defaultValue={answer.answer_text} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="is_correct" defaultChecked={answer.is_correct} /> Correct
          </label>
        </div>
        <div>
          <button type="submit">Update Answer</button>
        </div>
      </form>
    </div>
  )
}

