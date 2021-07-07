import multer from "multer"
import path from "path"
import fs, { stat } from "fs"

const CURRENT_WORKING_DIR = process.cwd();
const imageDist = {
    'productCategory': path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures/prodectCategory'),
    'productID': path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures/productID'),
    'services': path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures/services'),
    'users': path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures/users'),
    'userSession': path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures/users'),
}

const checkFolder = (file) => new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                resolve(true)
            } else {
                reject(err);
            }
        } else if (stats) {
            resolve(stats.isFile())
        } else {
            resolve(true)
        }
    })
})

const createDir = (file) => new Promise((resolve, reject) => {

    fs.mkdir(file, (err) => {
        if (err) reject(err);
        resolve(true)
    })
})

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const dir = imageDist[req.baseUrl.split('/')[req.baseUrl.split('/').length - 1]]
            const notExist = await checkFolder(dir)
            if (notExist) {
                await createDir(dir)
            }
            cb(null, dir)
        } catch (error) {
            cb(error, false)
        }
    },
    filename: async (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage, fileFilter: imageFilter, preservePath: true })

export default upload