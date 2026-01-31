import type { Todo } from './types'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function fetchTodos(): Promise<Todo[]> {
  if (!API_BASE) return []
  const res = await fetch(`${API_BASE}/api/todos`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function createTodo(text: string): Promise<Todo> {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}

export async function updateTodo(id: string, data: { done?: boolean; text?: string }): Promise<Todo> {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete todo')
}

export function useApi(): boolean {
  return Boolean(API_BASE)
}
