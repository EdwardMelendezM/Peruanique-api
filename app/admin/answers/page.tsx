import React from 'react'
import Link from 'next/link'
import { prisma } from '@/libs/prisma'
import { deleteAnswerAction } from '@/features/admin/actions/admin-actions'

export default async function AnswersPage() {
  const answers = await prisma.answer.findMany({ include: { question: { include: { node: true } } }, orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Answers</h1>
      <p>
        <Link href="/admin/answers/new">New Answer</Link>
      </p>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Text</th>
            <th>Question</th>
            <th>Node</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a) => (
            <tr key={a.id}>
              <td>{a.answer_text.slice(0, 80)}</td>
              <td>{a.question?.question_text.slice(0, 60)}</td>
              <td>{a.question?.node?.title}</td>
              <td>
                <Link href={`/admin/answers/${a.id}`}>Edit</Link>
                {' | '}
                <form action={deleteAnswerAction} method="post" style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={a.id} />
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

