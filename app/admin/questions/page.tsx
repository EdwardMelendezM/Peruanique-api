import React from 'react'
import Link from 'next/link'
import { prisma } from '@/libs/prisma'
import { deleteQuestionAction } from '@/features/admin/actions/admin-actions'

export default async function QuestionsPage() {
  const questions = await prisma.question.findMany({ include: { node: { include: { course: true } } }, orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Questions</h1>
      <p>
        <Link href="/admin/questions/new">New Question</Link>
      </p>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Text</th>
            <th>Node</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.question_text.slice(0, 80)}</td>
              <td>{q.node?.title}</td>
              <td>{q.node?.course?.name}</td>
              <td>
                <Link href={`/admin/questions/${q.id}`}>Edit</Link>
                {' | '}
                <form action={deleteQuestionAction} method="post" style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={q.id} />
                  <button type="submit" style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

