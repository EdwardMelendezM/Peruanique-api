import React from 'react'
import { prisma } from '@/libs/prisma'
import { updateCourseAction } from '@/features/admin/actions/admin-actions'

type Props = { params: { id: string } }

export default async function EditCoursePage({ params }: Props) {
  const course = await prisma.course.findUnique({ where: { id: params.id } })
  if (!course) return <div>Course not found</div>

  return (
    <div>
      <h1>Edit Course</h1>
      <form action={updateCourseAction} method="post">
        <input type="hidden" name="id" value={course.id} />
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" defaultValue={course.name} />
        </div>
        <div>
          <label htmlFor="color_theme">Color Theme</label>
          <input id="color_theme" name="color_theme" defaultValue={course.color_theme ?? ''} />
        </div>
        <div>
          <label htmlFor="icon_url">Icon URL</label>
          <input id="icon_url" name="icon_url" defaultValue={course.icon_url ?? ''} />
        </div>
        <div>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  )
}

