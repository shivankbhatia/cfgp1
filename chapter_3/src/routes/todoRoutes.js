import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`)
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

router.post('/', (req, res) => {
    const { task } = req.body
    const newTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES(?, ?)`)
    const result = newTodo.run(req.userId, task)
    res.json({ id: result.lastInsertRowid, task, completed: 0 })
})

router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
    updatedTodo.run(completed, id)
    res.json({ message: "Todo completed." })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const user_id = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, user_id)
    res.status(200).json({ message: "Deleted Successfully." })
})

export default router