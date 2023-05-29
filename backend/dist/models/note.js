"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//scheme for notes
const noteSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true }); //this is to be managed by mongodb
//create a model of type Note to be exported for use in code
exports.default = (0, mongoose_1.model)("Note", noteSchema);
