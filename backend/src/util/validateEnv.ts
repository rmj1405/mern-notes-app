import { cleanEnv } from "envalid"
import { port, str } from "envalid/dist/validators"

//ensures that server does not run with invalid variables at runtime, server crashes straight away
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),  
    SESSION_SECRET: str()
})
