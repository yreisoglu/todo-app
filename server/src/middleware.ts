import multer from "multer";
import { Multer } from "multer";
import path from "path";
import { imageMimeTypes } from "./Common/extensions";
const storage: multer.StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join("./src/Uploads/"));
    },
    filename: function (req, file, cb) {
        let error = null;
        if (file.fieldname === "image" && !imageMimeTypes.includes(file.mimetype)) {
            error = new Error("Invalid image type");
        }
        const fileName = `${Date.now().toString()}_${file.originalname}`;
        cb(error, fileName);
    }
});

export const upload: Multer = multer({ storage: storage });
