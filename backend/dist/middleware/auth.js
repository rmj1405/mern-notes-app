"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const requiresAuth = (req, res, next) => {
    //if there is a session in the req obj that contains the user id
    if (req.session.userId) {
        //call the next middleware
        next();
    }
    else {
        next((0, http_errors_1.default)(401, "User not authenticated"));
    }
};
exports.requiresAuth = requiresAuth;
