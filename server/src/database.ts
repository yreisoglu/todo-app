import mongoose, { Error } from "mongoose";

const mongoDbURI: string =
    typeof process.env.MONGODB_URI === "undefined" ? "mongodb://127.0.0.1:27017/todo" : process.env.MONGODB_URI;

export const db = () => {
    if (!mongoDbURI) throw new Error("Mongodb connection url is not defined");
    mongoose.connect(mongoDbURI);
    mongoose.connection.on("open", () => {
        console.log("MongoDB connected.");
    });
    mongoose.connection.on("error", (err: Error) => {
        console.error("MongoDB error: " + err);
    });
    mongoose.Promise = global.Promise;
};
