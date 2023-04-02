import { Schema, Types, model } from "mongoose";
import { ITodo } from "../Interfaces/todo.interface";

const TodoSchema: Schema = new Schema<ITodo>({
    authorId: {
        type: Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    attachment: {
        type: String
    },
    tag: {
        type: String
    },
});

export const TodoModel = model<ITodo>("Todo", TodoSchema);
