import "dotenv/config"
import express from "express"

//call express which is our server where we create the endpoints
const app = express()


//get request
app.get("/", (req, res) => {
    res.send("hello,world")
})

export default app
