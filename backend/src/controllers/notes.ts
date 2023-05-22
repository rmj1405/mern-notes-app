import { RequestHandler } from "express"
import NoteModel from "../models/note"

export const getNotes: RequestHandler = async (req, res, next) => { //await can only be used inside async
    try {
        //exec turns the fcn into a promise
        const notes = await NoteModel.find().exec() //await is syntactic sugar for promises, it waits until promise returns
        res.status(200).json(notes)
    } catch (error) {
        //express middleware
        next(error)
    }

}

export const getNote: RequestHandler = async (req, res, next) => {
    //params are the variables put into the url directly(behind the slash)
    const noteId = req.params.noteId

    try {
        //findById is a mongoose fcn
        const note = await NoteModel.findById(noteId).exec()
        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}

export const createNote: RequestHandler = async (req, res, next) => {
    const title = req.body.title
    const text = req.body.title
    try {
        //save new note in variable to send it back to client and to UI
        const newNote = await NoteModel.create({
            title: title,
            text: text,
        })
        //sending a response back to client
        res.status(201).json(newNote)
    } catch (error) {
        next(error)
    }
}
