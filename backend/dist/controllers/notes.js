"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotes = void 0;
const note_1 = __importDefault(require("../models/note"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefined_1 = require("../util/assertIsDefined");
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        //exec turns the fcn into a promise
        const notes = yield note_1.default.find({ userId: authenticatedUserId }).exec(); //await is syntactic sugar for promises, it waits until promise returns
        res.status(200).json(notes);
    }
    catch (error) {
        //express middleware
        next(error);
    }
});
exports.getNotes = getNotes;
const getNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //params are the variables put into the url directly(behind the slash)
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        //set error message if note id queried is of wrong shape - wrong len/invalid characters 
        if (!mongoose_1.default.isValidObjectId(noteId)) {
            throw (0, http_errors_1.default)(400, "Invalid Note ID");
        }
        //findById is a mongoose fcn
        const note = yield note_1.default.findById(noteId).exec();
        //set error message if note id does not exist
        if (!note) {
            throw (0, http_errors_1.default)(404, "Note not found");
        }
        if (!note.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        res.status(200).json(note);
    }
    catch (error) {
        next(error);
    }
});
exports.getNote = getNote;
const createNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!title) {
            throw (0, http_errors_1.default)(400, "Note must have a title");
        }
        //save new note in variable to send it back to client and to UI
        const newNote = yield note_1.default.create({
            //store authenticated user ID
            userId: authenticatedUserId,
            title: title,
            text: text,
        });
        //sending a response back to client
        res.status(201).json(newNote);
    }
    catch (error) {
        next(error);
    }
});
exports.createNote = createNote;
const updateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(noteId)) {
            throw (0, http_errors_1.default)(400, "Invalid Note ID");
        }
        if (!newTitle) {
            throw (0, http_errors_1.default)(400, "Note must have a title");
        }
        const note = yield note_1.default.findById(noteId).exec();
        if (!note) {
            throw (0, http_errors_1.default)(404, "Note not found");
        }
        if (!note.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        note.title = newTitle;
        note.text = newText;
        const updatedNote = yield note.save();
        res.status(200).json(updatedNote);
    }
    catch (error) {
        next(error);
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!mongoose_1.default.isValidObjectId(noteId)) {
            throw (0, http_errors_1.default)(400, "Invalid Note ID");
        }
        //look up the note and save it into the variable
        const note = yield note_1.default.findById(noteId).exec();
        if (!note) {
            throw (0, http_errors_1.default)(404, "Note not found");
        }
        if (!note.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        yield note.deleteOne();
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNote = deleteNote;
