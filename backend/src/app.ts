import "dotenv/config"
import express, { Request, Response, NextFunction } from "express"
import notesRoutes from "./routes/notes"
import userRoutes from "./routes/users"
import morgan from "morgan"
import createHttpError, { isHttpError } from "http-errors"
import session from "express-session"
import env from "./util/validateEnv"
import MongoStore from "connect-mongo"
import { requiresAuth } from "./middleware/auth"

//call express which is our server where we create the endpoints
const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.use(session({
    //the cookie that user receives for their session
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //time limit before cookie expires
        maxAge: 60 * 60 * 1000
    },
    //as long as user is using website, cookie will be refreshed automatically
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })
}))

app.use("/api/users", userRoutes)
app.use("/api/notes", requiresAuth, notesRoutes)

//create a middleware to catch requests that dont have a route set up for it
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found!")) //404 is resource not found
})


//express error handler: has to take these exact arguments with these types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    //log the error
    console.error(error)
    let errorMessage = "An unknown error occured"
    let statusCode = 500
    //check if it is instance of type HttpError
    if (isHttpError(error)) {
        statusCode = error.status
        errorMessage = error.message
    }
    res.status(statusCode).json({ error: errorMessage })
})

export default app
