import * as NotesController from "../controllers/notes"
import express from "express"

const router = express.Router()

//get request endpoint
router.get("/", NotesController.getNotes)

// :noteId is a variable, anyth behind the slash will be put into the request object as req.params
// s.t. it can be read in the getNote endpoint and look up this note by the id
router.get("/:noteId", NotesController.getNote)

//post request methods sends data to the server
router.post("/", NotesController.createNote)

//patch used to update a resource
router.patch("/:noteId", NotesController.updateNote)

router.delete("/:noteId", NotesController.deleteNote)

export default router
