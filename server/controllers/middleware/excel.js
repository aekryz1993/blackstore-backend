import multer from "multer"
import path from "path"
import fs from "fs"
import readXlsxFile from "read-excel-file/node"

const CURRENT_WORKING_DIR = process.cwd();
const dir = path.resolve(CURRENT_WORKING_DIR, 'resources/temporary')

const arrayToObj = (_rows) => {
    let data = []
    let obj = {}
    return new Promise((resolve, reject) => {
        _rows.forEach((col, idx) => {
            if (idx !== 0) {
                col.forEach((elem, idx) => {
                    obj[_rows[0][idx]] = elem
                })
                data = [...data, obj]
            }
        })
        resolve(data)
    })
}

export const readExcel = async (req, _, next) => {
    try {
        const targetFile = req.file.path
        const rows = await readXlsxFile(targetFile)
        const dataObj = await arrayToObj(rows)
        fs.unlink(targetFile, async (err) => {
            if (err) throw err
            req.dataObj = dataObj
        })
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

const upload = multer({ storage: storage, fileFilter: excelFilter})

export default upload