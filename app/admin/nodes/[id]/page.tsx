import React from 'react'
import { prisma } from '@/libs/prisma'
import { updateNodeAction } from '@/features/admin/actions/admin-actions'

type Props = { params: { id: string } }

export default async function EditNodePage({ params }: Props) {
  const node = await prisma.roadmapNode.findUnique({ where: { id: params.id }, include: { course: true } })
  if (!node) return <div>Node not found</div>

  return (
    <div>
      <h1>Edit Node</h1>
      <form action={updateNodeAction} method="post">
        <input type="hidden" name="id" value={node.id} />
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={node.title} />
        </div>
        <div>
          <label htmlFor="order_index">Order index</label>
          <input id="order_index" name="order_index" type="number" defaultValue={node.order_index} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="is_boss_level" defaultChecked={node.is_boss_level} /> Boss level
          </label>
        </div>
        <div>
          <button type="submit">Update Node</button>
        </div>
      </form>
    </div>
  )
}

