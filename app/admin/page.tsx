import React from 'react'
import { prisma } from '@/libs/prisma'

export default async function AdminPage() {
  const courses = await prisma.course.findMany({ take: 5 })

  return (
	<div>
	  <h1>Admin Dashboard</h1>
	  <section>
		<h2>Quick links</h2>
		<ul>
		  <li>
			<a href="/admin/courses">Manage Courses ({courses.length})</a>
		  </li>
		</ul>
	  </section>
	</div>
  )
}


