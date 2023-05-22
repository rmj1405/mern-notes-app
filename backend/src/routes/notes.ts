import * as NotesController from "../controllers/notes"
import express from "express"

const router = express.Router()

//get request endpoint
router.get("/", NotesController.getNotes)

router.get("/:noteId", NotesController.getNote)

//post request methods sends data to the server
router.post("/", NotesController.createNote)

export default router
