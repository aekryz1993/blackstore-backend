import multer from "multer"
import path from "path"

const CURRENT_WORKING_DIR = process.cwd();
const imageDist = path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures');

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDist)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage, fileFilter: imageFilter })

export default upload