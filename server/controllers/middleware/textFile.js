import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { styleExcel } from "../../helpers/excel";

// const CURRENT_WORKING_DIR = process.cwd();
// const tempDir = path.resolve(CURRENT_WORKING_DIR, "resources/temporary");
// const dirToSave = path.resolve(
//   CURRENT_WORKING_DIR,
//   "resources/static/assets/txt/codes"
// );

export const readTxt = (req, res, next) => {
  async function read() {
    try {
      const file = req.file;
      if (!file) {
        req.data = null;
        return res.status(400).json({ message: "Please upload a file" });
      }
      const regex = /[a-z0-9]/gi;
      const data = Buffer.from(file.buffer)
        .toString("utf-8")
        .split(/\r?\n/)
        .filter(
          (txt) =>
            txt.length === 18 &&
            txt.match(regex) &&
            txt.match(regex).length === 18
        );
      req.data = data;
      next();
    } catch (error) {
      throw error;
    }
  }
  read();
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/plain") {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

// const checkFolder = (file) =>
//   new Promise((resolve, reject) => {
//     fs.stat(file, (err, stats) => {
//       if (err) {
//         if (err.code === "ENOENT") {
//           resolve(true);
//         } else {
//           reject(err);
//         }
//       } else if (stats) {
//         resolve(stats.isFile());
//       } else {
//         resolve(true);
//       }
//     });
//   });

// const createDir = (file) =>
//   new Promise((resolve, reject) => {
//     fs.mkdir(file, (err) => {
//       if (err) reject(err);
//       resolve(true);
//     });
//   });

const storage = multer.memoryStorage();
// multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       const dir = isStorage ? dirToSave : tempDir;
//       const notExist = await checkFolder(dir);

//       if (notExist) {
//         await createDir(dir);
//       }

//       cb(null, dir);
//     } catch (error) {
//       cb(error, false);
//     }
//   },
//   filename: async (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const uploadTextFileHelper = () => {
  const upload = multer({ storage, fileFilter });
  return upload.single("file");
};

export default uploadTextFileHelper;
