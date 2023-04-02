import { Request, Response, Router } from "express";
import { UserModel } from "../Models/User";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

export const router = Router();

const TOKEN_KEY = process.env.TOKEN_KEY;

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json("All input is required");
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            email: email,
            password: encryptedPassword
        });

        const token = sign({ user }, TOKEN_KEY as string, { expiresIn: "2h" });

        return res.status(200).json({
            id: user._id,
            email: user.email,
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(404).json(error);
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json("All input is required");
        }
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = sign({ accountId: user._id, email }, TOKEN_KEY as string, {
                expiresIn: "12h"
            });

            return res.status(200).json({
                id: user._id,
                email: user.email,
                token: token
            });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.error(error);
        return res.status(404).json(error);
    }
});
