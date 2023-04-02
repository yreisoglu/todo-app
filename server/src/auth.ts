import { Request, Response } from "express";
import { JwtPayload, decode, verify } from "jsonwebtoken";
import { Types } from "mongoose";
const TOKEN_KEY = process.env.TOKEN_KEY;

export const auth = (req: Request, res: Response, next: Function) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        verify(token, TOKEN_KEY as string);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

export const isCurrentUser = (req: Request, res: Response, authorId: Types.ObjectId | undefined) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    const payload = decode(token) as JwtPayload;

    if (payload.accountId !== authorId?.toString()) {
        throw "Only todo's author can edit";
    }
    return true;
};

export const getUserIdFromToken = (req: Request) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const payload = decode(token) as JwtPayload;
    return payload.accountId;
};
