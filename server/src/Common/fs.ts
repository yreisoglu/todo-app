import { unlink } from "fs/promises";

export const removeFile = async (path: string) => {
    await unlink(path);
};

export const getFileNameFromFiles = (files: Express.Multer.File[], field: string) => {
    const fileName = files.find((file: Express.Multer.File) => file.fieldname === field)?.filename;
    return fileName;
};
