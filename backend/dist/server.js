"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const mongoose_1 = __importDefault(require("mongoose"));
//connection pt on server
const port = validateEnv_1.default.PORT;
//connect mongoose to mongodb
//connect returns a promise so we must use .then to define what to do after it succeeds
mongoose_1.default.connect(validateEnv_1.default.MONGO_CONNECTION_STRING)
    .then(() => {
    console.log("Mongoose connected");
    //callback of server
    app_1.default.listen(port, () => {
        console.log("server running on port: " + port);
    });
})
    .catch(console.error);
