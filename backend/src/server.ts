import express from "express"
//call express which is our server where we create the endpoints
const app = express()
const port = 5001 //connection pt on server

//get request
app.get("/", (req, res) => {
    res.send("hello,world")
});

//callback of server
app.listen(port, () => {
    console.log("server running on port: " + port)
});