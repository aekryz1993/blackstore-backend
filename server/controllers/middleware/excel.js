import multer from "multer"
import path from "path"
import fs from "fs"
import xlsx from "xlsx"
import { serverErrorMessage } from "../../utils/messages";

const CURRENT_WORKING_DIR = process.cwd();
const dir = path.resolve(CURRENT_WORKING_DIR, 'resources/temporary')

export const readExcel = async (req, res, next) => {
    try {
        const targetFile = req.file.path
        const file = xlsx.readFile(targetFile)
        const sheet = file.Sheets[file.SheetNames[0]]
        const rows = xlsx.utils.sheet_to_json(sheet)
        fs.unlink(targetFile, async (err) => {
            if (err) throw err
        })
        req.dataObj = rows
        next()
    } catch (error) {
        return res.json(serverErrorMessage(error.message));
    }
}

const excelFilter = (req, file, cb) => {
    if (file.mimetype.includes("sheet") || file.mimetype.includes("spreadsheetml")) {
        cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
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

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
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
        cb(null, file.originalname)
    }
})

const uploadExcel = multer({ storage: storage, fileFilter: excelFilter})

export default uploadExcel