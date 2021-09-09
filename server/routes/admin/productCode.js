import express from "express";

import uploadExcel, { readExcel } from "../../controllers/middleware/excel";
import { checkPermission } from "../../controllers/middleware/permissions";
import {
  addProductCode,
  addMultiProductCode,
} from "../../controllers/productCode";
import { createCodesFromCommand, getCommands } from "../../controllers/commands";

const router = express.Router();

const productCodeRouter = (io) => {
  router.post("/add", checkPermission("addProduct"), addProductCode);
  router.post(
    "/addMulti",
    checkPermission("addProduct"),
    uploadExcel(false),
    readExcel,
    addMultiProductCode
  );
  router.get(
    "/getCommands/:page/:isTreated",
    checkPermission("viewcmnd"),
    getCommands
  );
  router.post(
    "/sendCommand/:userId/:commandId/:categoryId",
    checkPermission("viewcmnd"),
    uploadExcel(false),
    readExcel,
    createCodesFromCommand(io),
  );
  return router;
};

export default productCodeRouter;
