"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const notes_1 = __importDefault(require("./routes/notes"));
const users_1 = __importDefault(require("./routes/users"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importStar(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const auth_1 = require("./middleware/auth");
//call express which is our server where we create the endpoints
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    //the cookie that user receives for their session
    secret: validateEnv_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //time limit before cookie expires
        maxAge: 60 * 60 * 1000
    },
    //as long as user is using website, cookie will be refreshed automatically
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: validateEnv_1.default.MONGO_CONNECTION_STRING
    })
}));
app.use("/api/users", users_1.default);
app.use("/api/notes", auth_1.requiresAuth, notes_1.default);
//create a middleware to catch requests that dont have a route set up for it
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Endpoint not found!")); //404 is resource not found
});
//express error handler: has to take these exact arguments with these types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    //log the error
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    //check if it is instance of type HttpError
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
