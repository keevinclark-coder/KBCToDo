import { useState, useCallback } from 'react'
import { TodoList } from './TodoList'
import { TodoInput } from './TodoInput'
import type { Todo } from './types'
import './App.css'

const STORAGE_KEY = 'kbctodo-todos'

function loadTodos(): Todo[] {
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

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  const persist = useCallback((next: Todo[]) => {
    setTodos(next)
    saveTodos(next)
  }, [])

  const addTodo = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: trimmed,
        done: false,
      }
      persist([...todos, newTodo])
    },
    [todos, persist]
  )

  const toggleTodo = useCallback(
    (id: string) => {
      persist(
        todos.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t
        )
      )
    },
    [todos, persist]
  )

  const deleteTodo = useCallback(
    (id: string) => {
      persist(todos.filter((t) => t.id !== id))
    },
    [todos, persist]
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>KBCToDo</h1>
        <p className="tagline">Keep track of what matters</p>
      </header>
      <main className="app-main">
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  )
}
