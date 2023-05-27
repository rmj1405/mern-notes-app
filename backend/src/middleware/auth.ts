import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req,res,next) => {
    //if there is a session in the req obj that contains the user id
    if(req.session.userId) {
        //call the next middleware
        next()
    } else {
        next(createHttpError(401, "User not authenticated"))
    }
}