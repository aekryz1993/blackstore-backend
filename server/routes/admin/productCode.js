import express from "express";

import uploadExcel, { readExcel } from "../../controllers/middleware/excel";
import { checkPermission } from "../../controllers/middleware/permissions";
import {
  addProductCode,
  addMultiProductCode,
} from "../../controllers/productCode";
import { treatCommand, getCommands } from "../../controllers/commands";

const router = express.Router();

const productCodeRouter = (io, redisClient) => {
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
    treatCommand(io, redisClient),
  );
  return router;
};

export default productCodeRouter;
