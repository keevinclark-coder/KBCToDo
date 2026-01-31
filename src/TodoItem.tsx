import type { Todo } from './types'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className={`todo-item ${todo.done ? 'todo-item--done' : ''}`}
      data-testid={`todo-${todo.id}`}
    >
      <label className="todo-item__label">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          className="todo-item__checkbox"
          aria-label={`Mark "${todo.text}" as ${todo.done ? 'incomplete' : 'complete'}`}
        />
        <span className="todo-item__text">{todo.text}</span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="todo-item__delete"
        aria-label={`Delete "${todo.text}"`}
      >
        ×
      </button>
    </li>
  )
}
