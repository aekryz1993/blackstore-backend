import multer from "multer";

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

const storage = multer.memoryStorage();

const uploadTextFileHelper = () => {
  const upload = multer({ storage, fileFilter });
  return upload.single("file");
};

export default uploadTextFileHelper;
