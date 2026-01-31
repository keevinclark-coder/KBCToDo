import { useState, useCallback, useEffect } from 'react'
import { TodoList } from './TodoList'
import { TodoInput } from './TodoInput'
import type { Todo } from './types'
import * as api from './api'
import './App.css'

const STORAGE_KEY = 'kbctodo-todos'

function loadTodosFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is Todo =>
        t != null &&
        typeof t === 'object' &&
        typeof (t as Todo).id === 'string' &&
        typeof (t as Todo).text === 'string' &&
        typeof (t as Todo).done === 'boolean'
    )
  } catch {
    return []
  }
}

function saveTodosToStorage(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const useBackend = api.useApi()

  useEffect(() => {
    if (useBackend) {
      api.fetchTodos().then(setTodos).catch((e) => setError(String(e))).finally(() => setLoading(false))
    } else {
      setTodos(loadTodosFromStorage())
      setLoading(false)
    }
  }, [useBackend])

  const persist = useCallback(
    (next: Todo[]) => {
      setTodos(next)
      if (!useBackend) saveTodosToStorage(next)
    },
    [useBackend]
  )

  const addTodo = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      if (useBackend) {
        try {
          const todo = await api.createTodo(trimmed)
          setTodos((prev) => [...prev, todo])
        } catch (e) {
          setError(String(e))
        }
      } else {
        const newTodo: Todo = { id: crypto.randomUUID(), text: trimmed, done: false }
        persist([...todos, newTodo])
      }
    },
    [useBackend, todos, persist]
  )

  const toggleTodo = useCallback(
    async (id: string) => {
      const t = todos.find((x) => x.id === id)
      if (!t) return
      if (useBackend) {
        try {
          const updated = await api.updateTodo(id, { done: !t.done })
          setTodos((prev) => prev.map((x) => (x.id === id ? updated : x)))
        } catch (e) {
          setError(String(e))
        }
      } else {
        persist(todos.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
      }
    },
    [useBackend, todos, persist]
  )

  const deleteTodo = useCallback(
    async (id: string) => {
      if (useBackend) {
        try {
          await api.deleteTodo(id)
          setTodos((prev) => prev.filter((x) => x.id !== id))
        } catch (e) {
          setError(String(e))
        }
      } else {
        persist(todos.filter((t) => t.id !== id))
      }
    },
    [useBackend, todos, persist]
  )

  if (loading) {
    return (
      <div className="app">
        <p className="tagline">Loading…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>KBCToDo</h1>
        <p className="tagline">Keep track of what matters</p>
      </header>
      {error && (
        <p className="tagline" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
      <main className="app-main">
        <TodoInput onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </main>
    </div>
  )
}
