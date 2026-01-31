import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 10000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/todos', async (_req, res) => {
  try {
    const todos = await prisma.todo.findMany({ orderBy: { id: 'asc' } })
    res.json(todos)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
})

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text required' })
    }
    const todo = await prisma.todo.create({
      data: { text: text.trim(), done: false },
    })
    res.status(201).json(todo)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { done, text } = req.body
    const data: { done?: boolean; text?: string } = {}
    if (typeof done === 'boolean') data.done = done
    if (typeof text === 'string' && text.trim()) data.text = text.trim()
    const todo = await prisma.todo.update({ where: { id }, data })
    res.json(todo)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update todo' })
  }
})

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.todo.delete({ where: { id } })
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})

app.listen(port, () => {
  console.log(`KBCToDo API listening on port ${port}`)
})
