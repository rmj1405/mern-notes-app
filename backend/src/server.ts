import app from "./app"
import env from "./util/validateEnv"
import mongoose from "mongoose"

//connection pt on server
const port = env.PORT

//connect mongoose to mongodb
//connect returns a promise so we must use .then to define what to do after it succeeds
mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected")
        //callback of server
        app.listen(port, () => {
            console.log("server running on port: " + port)
        })
    })
    .catch(console.error)


