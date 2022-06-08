import express from "express";

import uploadExcel, { readExcel } from "../../controllers/middleware/excel";
import uploadTxt, { readTxt } from "../../controllers/middleware/textFile";
import { checkPermission } from "../../controllers/middleware/permissions";
import {
  addProductCode,
  addMultiProductCodeByMultiCategory,
  addMultiProductCode,
  getProductCodesByMultCategoriesFromAdmin,
} from "../../controllers/productCode";
import { treatCommand, getCommands } from "../../controllers/commands";

const router = express.Router();

const productCodeRouter = (io, redisClient) => {
  router.post("/add", checkPermission("addProduct"), addProductCode);
  router.post(
    "/addMultiByMultiCategories",
    checkPermission("addProduct"),
    uploadExcel(false),
    readExcel,
    addMultiProductCodeByMultiCategory
  );
  router.post(
    "/addMulti/:categoryId",
    checkPermission("addProduct"),
    uploadTxt(),
    readTxt,
    addMultiProductCode
  );
  router.get(
    "/get/:serviceName/:orders",
    getProductCodesByMultCategoriesFromAdmin
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
    treatCommand(io, redisClient)
  );
  return router;
};

export default productCodeRouter;
