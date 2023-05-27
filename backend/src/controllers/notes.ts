import { RequestHandler } from "express"
import NoteModel from "../models/note"
import createHttpError from "http-errors"
import mongoose from "mongoose"
import { assertIsDefined } from "../util/assertIsDefined"

export const getNotes: RequestHandler = async (req, res, next) => { //await can only be used inside async
    const authenticatedUserId = req.session.userId
    
    try {
        assertIsDefined(authenticatedUserId)
        //exec turns the fcn into a promise
        const notes = await NoteModel.find({userId:authenticatedUserId}).exec() //await is syntactic sugar for promises, it waits until promise returns
        res.status(200).json(notes)
    } catch (error) {
        //express middleware
        next(error)
    }

}

export const getNote: RequestHandler = async (req, res, next) => {
    //params are the variables put into the url directly(behind the slash)
    const noteId = req.params.noteId
    const authenticatedUserId = req.session.userId

    try {
        assertIsDefined(authenticatedUserId)
        //set error message if note id queried is of wrong shape - wrong len/invalid characters 
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid Note ID")
        }
        //findById is a mongoose fcn
        const note = await NoteModel.findById(noteId).exec()

        //set error message if note id does not exist
        if (!note) {
            throw createHttpError(404, "Note not found")
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note")
        }

        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}

interface CreateNoteBody {
    title?: string,
    text?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title
    const text = req.body.text
    const authenticatedUserId = req.session.userId
    
    try {
        assertIsDefined(authenticatedUserId)

        if (!title) {
            throw createHttpError(400, "Note must have a title")
        }
        //save new note in variable to send it back to client and to UI
        const newNote = await NoteModel.create({
            //store authenticated user ID
            userId: authenticatedUserId,
            title: title,
            text: text,
        })
        //sending a response back to client
        res.status(201).json(newNote)
    } catch (error) {
        next(error)
    }
}

interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string,
    text?: string,
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId
    const newTitle = req.body.title
    const newText = req.body.text
    const authenticatedUserId = req.session.userId

    try {
        assertIsDefined(authenticatedUserId)

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid Note ID")
        }

        if (!newTitle) {
            throw createHttpError(400, "Note must have a title")
        }

        const note = await NoteModel.findById(noteId).exec()

        if (!note) {
            throw createHttpError(404, "Note not found")
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note")
        }

        note.title = newTitle
        note.text = newText

        const updatedNote = await note.save()

        res.status(200).json(updatedNote)
    } catch (error) {
        next(error)
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId
    const authenticatedUserId = req.session.userId

    try {
        assertIsDefined(authenticatedUserId)

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid Note ID")
        }
        //look up the note and save it into the variable
        const note = await NoteModel.findById(noteId).exec()

        if (!note) {
            throw createHttpError(404, "Note not found")
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note")
        }

        await note.deleteOne()

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}