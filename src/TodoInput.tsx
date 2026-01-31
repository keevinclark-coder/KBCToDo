import { useState, FormEvent, useRef } from 'react'
import './TodoInput.css'

interface TodoInputProps {
  onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onAdd(value)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a task…"
        className="todo-input__field"
        aria-label="New todo"
      />
      <button type="submit" className="todo-input__btn" aria-label="Add todo">
        Add
      </button>
    </form>
  )
}
