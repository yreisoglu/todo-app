import { unlink } from "fs/promises";

export const removeFile = async (path: string) => {
    try {
        await unlink(path);
    } catch (error) {
        console.error(error);
    }
};

export const getFileNameFromFiles = (files: Express.Multer.File[], field: string) => {
    const fileName = files.find((file: Express.Multer.File) => file.fieldname === field)?.filename;
    return fileName;
};
