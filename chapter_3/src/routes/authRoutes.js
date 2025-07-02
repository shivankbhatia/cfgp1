import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import dotenv from 'dotenv'
dotenv.config();

const router = express.Router()

router.post('/register', (req, res) => {
    const { username, password } = req.body
    const hashedPass = bcrypt.hashSync(password, 10)

    try {
        const insertUser = db.prepare(`INSERT INTO user (username, password) VALUES(?, ?)`)
        const result = insertUser.run(username, hashedPass)

        const defaultTodo = "Hello! Add your first ToDo."
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES(?, ?)`)
        const result2 = insertTodo.run(result.lastInsertRowid, defaultTodo)

        //create a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

        res.status(201).send({ token })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    try {
        const getUser = db.prepare(`SELECT * FROM user WHERE username = ?`)
        const user = getUser.get(username)

        if (!user) {
            return res.status(404).send({ message: "User not found!" })
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid)
            res.status(203).send({ "message": "Access Denied!" })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1m' })
        res.status(200).send({ token })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
})

export default router