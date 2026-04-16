import React from 'react'
import { createNodeAction } from '@/features/admin/actions/admin-actions'
import { prisma } from '@/libs/prisma'

export default async function NewNodePage() {
  const courses = await prisma.course.findMany({ orderBy: { name: 'asc' } })

  return (
    <div>
      <h1>New Node</h1>
      <form action={createNodeAction} method="post">
        <div>
          <label htmlFor="courseId">Course</label>
          <select id="courseId" name="courseId">
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" />
        </div>
        <div>
          <label htmlFor="order_index">Order index</label>
          <input id="order_index" name="order_index" type="number" defaultValue={0} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="is_boss_level" /> Boss level
          </label>
        </div>
        <div>
          <button type="submit">Create Node</button>
        </div>
      </form>
    </div>
  )
}

