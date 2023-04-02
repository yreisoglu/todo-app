import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { json, urlencoded } from "body-parser";
import { db } from "./database";
import { router as userRouter } from "./Routers/user-router";
import { router as todoRouter } from "./Routers/todo-router";

const app: Application = express();
db();

const PORT: number = 5000;

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use("/Uploads", express.static("Uploads"));

app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.listen(PORT, (): void => {
    console.log("SERVER IS UP ON PORT:", PORT);
});

process.on("uncaughtException", (err) => {
    console.log("Caught exception: ", err);
});
