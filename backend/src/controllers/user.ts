import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenicatedUserId = req.session.userId

    try {
        if (!authenicatedUserId) {
            throw createHttpError(401, "User not authenticated")
        }
        const user = await UserModel.findById(authenicatedUserId).select("+email").exec()
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const email = req.body.email
    //explicitly differentiate between raw and hashed password
    const passwordRaw = req.body.password

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing")
        }

        //findOne returns a single model which matches the filter
        const existingUsername = await UserModel.findOne({ username: username }).exec()

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.")
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec()

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.")
        }

        //2nd argument is num of salting rounds 
        const passwordHashed = await bcrypt.hash(passwordRaw, 10)

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed
        })

        req.session.userId = newUser._id

        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing")
        }

        //findOne returns a single model which matches the filter
        const user = await UserModel.findOne({ username: username }).select("+password +email").exec()

        if (!user) {
            throw createHttpError(401, "Invalid credentials")
        }

        //comapare raw password keyed in by user with the hashed password stored in database
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials")
        }

        req.session.userId = user._id
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error)
        } else {
            res.sendStatus(200)
        }
    })
}