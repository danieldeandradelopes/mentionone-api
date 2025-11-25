import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename(req, file, callback) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      callback(null, filename);
    },
  }),
});

export default upload;
