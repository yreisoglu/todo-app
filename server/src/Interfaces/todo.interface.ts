import { Types } from "mongoose";

export interface ITodo {
    authorId: Types.ObjectId | undefined;
    content: string;
    image?: string;
    attachment?: string;
    tag?: string;
}
