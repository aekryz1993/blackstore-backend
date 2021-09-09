import multer from "multer";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import { serverErrorMessage } from "../../utils/messages";
import { styleExcel } from "../../helpers/excel";

const CURRENT_WORKING_DIR = process.cwd();
const tempDir = path.resolve(CURRENT_WORKING_DIR, "resources/temporary");
const dirToSave = path.resolve(CURRENT_WORKING_DIR, "resources/static/assets/excel/codes");

export const readExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      req.dataObj = null;
      // next();
    }
    const targetFile = req.file.path;
    const file = xlsx.readFile(targetFile);
    const sheet = file.Sheets[file.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    fs.unlink(targetFile, async (err) => {
      if (err) throw err;
    });
    req.dataObj = rows;
    next();
  } catch (error) {
    throw error
  }
};

export const writeExcel = (data, serviceName) =>
  new Promise((resolve, reject) => {
    try {
      const codes = data.map(item => Object.fromEntries((Object.entries(item).filter(([key, _]) => key !== 'id'))))
      const { wscols, wsrows } = styleExcel(codes);
      const ws = xlsx.utils.json_to_sheet(codes);
      ws["!cols"] = wscols;
      ws["!rows"] = wsrows;
      const wb = { Sheets: { CODES: ws }, SheetNames: ["CODES"] };
      const destination = path.join(tempDir, `${serviceName}-${Date.now()}.xlsx`);
      xlsx.writeFile(wb, destination);
      resolve(destination
        .split("/")
        .slice(
          destination
            .split("/")
            .findIndex((ele) => ele === "resources") + 1
        )
        .join("/"));
    } catch (error) {
      reject(error);
    }
  });

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("sheet") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const checkFolder = (file) =>
  new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve(true);
        } else {
          reject(err);
        }
      } else if (stats) {
        resolve(stats.isFile());
      } else {
        resolve(true);
      }
    });
  });

const createDir = (file) =>
  new Promise((resolve, reject) => {
    fs.mkdir(file, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });

const storage = (isStorage) => multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dir = isStorage ? dirToSave : tempDir
      const notExist = await checkFolder(dir);

      if (notExist) {
        await createDir(dir);
      }

      cb(null, dir);
    } catch (error) {
      cb(error, false);
    }
  },
  filename: async (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadExcel = (isStorage) => multer({ storage: storage(isStorage), fileFilter: excelFilter });

const uploadExcelHelper = (isStorage) => {
  const upload = uploadExcel(isStorage);
  return upload.single("file")
};

export default uploadExcelHelper;
