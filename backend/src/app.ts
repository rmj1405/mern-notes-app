import "dotenv/config"
import express, { Request, Response, NextFunction } from "express"
import notesRoutes from "./routes/notes"
import morgan from "morgan"

//call express which is our server where we create the endpoints
const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/notes", notesRoutes)

//create a middleware to catch requests that dont have a route set up for it
app.use((req, res, next) => {
    next(Error("Endpoint not found!"))
})


//express error handler: has to take these exact arguments with these types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    //log the error
    console.error(error)
    let errorMessage = "An unknown error occured"
    //check if it is actually of type Error
    if (error instanceof Error) errorMessage = error.message
    res.status(500).json({ error: errorMessage })
})

export default app
