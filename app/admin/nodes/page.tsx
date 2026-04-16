import React from 'react'
import Link from 'next/link'
import { prisma } from '@/libs/prisma'
import { deleteNodeAction } from '@/features/admin/actions/admin-actions'

export default async function NodesPage() {
  const nodes = await prisma.roadmapNode.findMany({ include: { course: true }, orderBy: { order_index: 'asc' } })

  return (
    <div>
      <h1>Nodes</h1>
      <p>
        <Link href="/admin/nodes/new">New Node</Link>
      </p>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Course</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <tr key={n.id}>
              <td>{n.title}</td>
              <td>{n.course?.name}</td>
              <td>{n.order_index}</td>
              <td>
                <Link href={`/admin/nodes/${n.id}`}>Edit</Link>
                {' | '}
                <form action={deleteNodeAction} method="post" style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={n.id} />
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

