import React from 'react'
import { prisma } from '@/libs/prisma'
import { createQuestionAction } from '@/features/admin/actions/admin-actions'

export default async function NewQuestionPage() {
  const nodes = await prisma.roadmapNode.findMany({ orderBy: { order_index: 'asc' } })

  return (
    <div>
      <h1>New Question</h1>
      <form action={createQuestionAction} method="post">
        <div>
          <label htmlFor="nodeId">Node</label>
          <select id="nodeId" name="nodeId">
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="question_text">Question text</label>
          <textarea id="question_text" name="question_text" />
        </div>
        <div>
          <label htmlFor="explanation_text">Explanation (optional)</label>
          <textarea id="explanation_text" name="explanation_text" />
        </div>
        <div>
          <button type="submit">Create Question</button>
        </div>
      </form>
    </div>
  )
}

