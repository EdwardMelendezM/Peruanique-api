import React from 'react'
import { createCourseAction } from '@/features/admin/actions/admin-actions'

export default function NewCoursePage() {
  return (
    <div>
      <h1>New Course</h1>
      <form action={createCourseAction} method="post">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" />
        </div>
        <div>
          <label htmlFor="color_theme">Color Theme</label>
          <input id="color_theme" name="color_theme" />
        </div>
        <div>
          <label htmlFor="icon_url">Icon URL</label>
          <input id="icon_url" name="icon_url" />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

