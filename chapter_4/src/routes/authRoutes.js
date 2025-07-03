import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import prisma from '../prismaClient.js'
dotenv.config();

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const hashedPass = bcrypt.hashSync(password, 10)

    try {
        const insertUser = await prisma.user.create({
            data: {
                username,
                password: hashedPass
            }
        })

        const defaultTodo = "Hello! Add your first ToDo."
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: insertUser.id
            }
        })

        //create a token
        const token = jwt.sign({ id: insertUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

        res.status(201).send({ token })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const getUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (!getUser) {
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