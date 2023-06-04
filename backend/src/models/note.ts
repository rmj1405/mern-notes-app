import { InferSchemaType, model, Schema } from "mongoose"

//scheme for notes
const noteSchema = new Schema({
    userId: { type:Schema.Types.ObjectId, required:true},
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true }) //this is to be managed by mongodb

//create a type of Note for typesafety in Typescript
type Note = InferSchemaType<typeof noteSchema>

//create a model of type Note to be exported for use in code
//model fcn takes in the model name and schema
export default model<Note>("Note", noteSchema)