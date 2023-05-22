import "dotenv/config"
import express, { Request, Response, NextFunction } from "express"
import notesRoutes from "./routes/notes"
import morgan from "morgan"
import createHttpError, { isHttpError } from "http-errors"

//call express which is our server where we create the endpoints
const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/notes", notesRoutes)

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
