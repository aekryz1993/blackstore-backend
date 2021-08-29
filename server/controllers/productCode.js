import {
  createProductCode,
  findAllProductCodes,
  findSoldProductCodesByUser,
  updateProductCode,
} from "../models/query/productCode";
import { findService, findServiceById } from "../models/query/service";
import { findProductCategoryById } from "../models/query/productCategory";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from "../utils/messages/service";
import {
  productCategoryAlreadyExistMsg,
  productCategoryNotExistMsg,
  productCategorySuccessRegistrationMsg,
} from "../utils/messages/productCategory";
import { saveCodes } from "./middleware/productCode";
import { findWallet, updateWallet } from "../models/query/wallet";
import {
  countCommands,
  createCommand,
  findCommandsByUser,
} from "../models/query/command";
import { writeExcel } from "./middleware/excel";
import { dataFormat } from "../helpers/excel";
import { paginateData } from "./helper";

export const addProductCode = (req, res) => {
  (async () => {
    const { serviceName, productName, code, Date, Serial } = req.body;
    try {
      const service = await findService(serviceName, "code");
      if (service === null) {
        return res.status(401).json(serviceNotExist(serviceName));
      }
      const productCategoryService =
        service.dataValues.ProductCategories.filter(
          (ProductCategorieItem) =>
            ProductCategorieItem.dataValues.label === productName
        );
      if (productCategoryService.length === 0) {
        return res.status(401).json(productCategoryNotExistMsg(productName));
      }

      const productCategory = await findProductCategoryById(
        productCategoryService[0].dataValues.id
      );

      const isProductCodeExist = productCategory.dataValues.ProductCodes.filter(
        (_productCode) => _productCode.dataValues.code === code
      );
      if (isProductCodeExist.length !== 0) {
        return res.status(409).json(productCategoryAlreadyExistMsg(code));
      }

      const { productCode } = await createProductCode({
        code,
        Date,
        Serial,
        ProductCategoryId: productCategoryService[0].dataValues.id,
      });
      return res
        .status(201)
        .json(
          productCategorySuccessRegistrationMsg(productCode.dataValues.code)
        );
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const addMultiProductCode = (req, res) => {
  (async () => {
    const body = req.body;
    const codes = req.dataObj;
    try {
      const service = await findServiceById(body.ServiceId);
      if (service === null) {
        throw serviceNotExist(body.serviceName);
      }
      const message = await saveCodes(codes, body.serviceName, body.ServiceId);
      return res.status(201).json(message);
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const getProductCodesByMultCategories = (req, res) => {
  (async () => {
    const { currency, amount, serviceName } = req.params;
    const orders = JSON.parse(req.params.order);
    const currentUserId = req.user.id;
    try {
      const wallet = await findWallet(currentUserId);
      let codes = {};
      let commands = [];
      if (
        wallet.dataValues[currency] > 0 &&
        wallet.dataValues[currency] >= amount
      ) {
        for (const order of orders) {
          const id = order["id"];
          const quantity = order["quantity"];
          const label = order["label"];
          if (quantity !== 0) {
            const productCodes = await findAllProductCodes(quantity, id);
            codes[label] = productCodes.map((product) =>
              Object.fromEntries(
                Object.entries(product).filter(
                  ([key, _]) => key === "dataValues"
                )
              )
            );
            codes[label] = codes[label].map((code) =>
              Object.fromEntries(
                Object.entries(code.dataValues).filter(
                  ([key, _]) =>
                    key !== "sold" &&
                    key !== "createdAt" &&
                    key !== "updatedAt" &&
                    key !== "ProductCategoryId" &&
                    key !== "UserId"
                )
              )
            );
            productCodes.forEach(async (product) => {
              await updateProductCode(product.id, currentUserId);
            });
            if (productCodes.length < quantity) {
              const newCommand = await createCommand({
                category: label,
                quantity: quantity - productCodes.length,
                serviceName,
                UserId: currentUserId,
              });
              commands = [...commands, newCommand];
            }
          }
        }
        const newCredit = wallet.dataValues[currency] - amount;
        await updateWallet({ UserId: currentUserId, newCredit, currency });
        codes = dataFormat(codes);
        const savedFile = await writeExcel(codes, serviceName);
        return res.status(200).json({
          codes,
          commands,
          savedFile,
          success: true,
          message: "تمت العملية بنجاح",
        });
      } else {
        throw { message: "رصيدك غير كاف لإجراء هذه العملية" };
      }
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const getSoldProductCodesByUser = (req, res) => {
  (async () => {
    const currentUserId = req.user.id;
    try {
      const productCodes = await findSoldProductCodesByUser(currentUserId);
      return res.status(200).json({ productCodes });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const getCommandsByUser = (req, res) => {
  (async () => {
    const currentUserId = req.user.id;
    const { page, isTreated } = req.params;
    try {
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, countCommands, 7, {userId: currentUserId, isTreated});
      const { commandsTreated, commandsWaiting } = await findCommandsByUser(
        currentUserId,
        limit,
        offset
      );
      return res
        .status(200)
        .json({
          commandsTreated,
          commandsWaiting,
          totalItems,
          nextPage,
          totalPages,
          success: true,
        });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
