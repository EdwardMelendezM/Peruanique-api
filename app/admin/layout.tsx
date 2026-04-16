import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <nav style={{ width: 240, padding: 16, borderRight: '1px solid #eee' }}>
            <h2>Admin</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link href="/admin">Dashboard</Link>
              </li>
              <li>
                <Link href="/admin/courses">Courses</Link>
              </li>
              <li>
                <Link href="/admin/nodes">Nodes</Link>
              </li>
              <li>
                <Link href="/admin/questions">Questions</Link>
              </li>
              <li>
                <Link href="/admin/answers">Answers</Link>
              </li>
            </ul>
          </nav>
          <main style={{ flex: 1, padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  )
}

