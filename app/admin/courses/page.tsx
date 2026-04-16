import React from 'react'
import Link from 'next/link'
import { prisma } from '@/libs/prisma'
import { deleteCourseAction } from '@/features/admin/actions/admin-actions'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Courses</h1>
      <p>
        <Link href="/admin/courses/new">New Course</Link>
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: '8px 0' }}>{c.name}</td>
              <td style={{ padding: '8px 0' }}>
                <Link href={`/admin/courses/${c.id}`}>Edit</Link>
                {' | '}
                <form action={deleteCourseAction} method="post" style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={c.id} />
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

