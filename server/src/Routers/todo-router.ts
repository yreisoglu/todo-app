import { Router, Request, Response } from "express";
import { auth, getUserIdFromToken, isCurrentUser } from "../auth";
import { TodoModel } from "../Models/Todo";
import { errorResponse, successResponse } from "../Common/responses";
import { upload } from "../middleware";
import { getFileNameFromFiles, removeFile } from "../Common/fs";

export const router = Router();

router.get("/", auth, async (req: Request, res: Response) => {
    try {
        const authorId = getUserIdFromToken(req);
        const todos = await TodoModel.find({ authorId });
        return successResponse(todos, res);
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});

router.post("/", auth, upload.any(), async (req: Request, res: Response) => {
    try {
        const { content, tag } = req.body;
        const authorId = getUserIdFromToken(req);
        if (!(content)) return errorResponse("content is required", res);

        const files = req.files as Express.Multer.File[];

        const image = getFileNameFromFiles(files, "image");
        const attachment = getFileNameFromFiles(files, "attachment");

        const todo = await TodoModel.create({
            authorId,
            content,
            image,
            attachment,
            tag
        });
        return successResponse(todo, res);
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});

router.put("/", auth, upload.any(), async (req: Request, res: Response) => {
    try {
        const { id, content, tag } = req.body;

        const todo = await TodoModel.findById(id).select("authorId image attachment");
        if (!todo) return errorResponse("This todo does not exists", res);

        if (isCurrentUser(req, res, todo?.authorId)) {
            const files = req.files as Express.Multer.File[];

            const image = getFileNameFromFiles(files, "image");
            const attachment = getFileNameFromFiles(files, "attachment");

            image && (await removeFile(`./src/Uploads/${todo?.attachment}`));
            attachment && (await removeFile(`./src/Uploads/${todo?.image}`));

            const result = await TodoModel.findByIdAndUpdate(id, { content, tag, image, attachment });

            return successResponse(result && "Todo updated successfully", res);
        }
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});

router.delete("/", auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        const todo = await TodoModel.findById(id);
        if (!todo) return errorResponse("This todo does not exists", res);

        if (isCurrentUser(req, res, todo.authorId)) {
            const result = await TodoModel.findByIdAndDelete(id);
            await removeFile(`./src/Uploads/${todo?.attachment}`);
            await removeFile(`./src/Uploads/${todo?.image}`);
            return successResponse(result, res);
        }
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});

router.get("/tags", auth, async (req: Request, res: Response) => {
    try {
        const authorId = getUserIdFromToken(req);
        const userTags = await TodoModel.find({ authorId }).distinct("tag");
        successResponse(userTags, res);
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});

router.get("/filter", auth, async (req: Request, res: Response) => {
    try {
        const { tag } = req.query;
        const authorId = getUserIdFromToken(req);
        const filteredTodos = await TodoModel.find({ authorId, tag });
        return successResponse(filteredTodos, res);
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});

router.get("/search", auth, async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const authorId = getUserIdFromToken(req);
        const filteredTodos = await TodoModel.find({ authorId: authorId, content: { $regex: search, $options: "i" } });
        return successResponse(filteredTodos, res);
    } catch (error) {
        console.error(error);
        return errorResponse(error, res);
    }
});
