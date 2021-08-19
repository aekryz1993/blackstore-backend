import {
  createProductCode,
  findAllProductCodes,
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
import { createCommand } from "../models/query/command";

export const addProductCode = (req, res) => {
  (async () => {
    const {serviceName, productName, code, Date, Serial} = req.body;
    try {
      const service = await findService(serviceName, 'code');
      if (service === null) {
        return res.status(401).json(serviceNotExist(serviceName));
      }
      const productCategoryService =
        service.dataValues.ProductCategories.filter(
          (ProductCategorieItem) =>
            ProductCategorieItem.dataValues.label === productName
        );
      if (productCategoryService.length === 0) {
        return res
          .status(401)
          .json(productCategoryNotExistMsg(productName));
      }

      const productCategory = await findProductCategoryById(
        productCategoryService[0].dataValues.id
      );

      const isProductCodeExist =
        productCategory.dataValues.ProductCodes.filter(
          (_productCode) => _productCode.dataValues.code === code
        );
      if (isProductCodeExist.length !== 0) {
        return res.status(409).json(productCategoryAlreadyExistMsg(code));
      }

      const { productCode } = await createProductCode({code, Date, Serial, ProductCategoryId: productCategoryService[0].dataValues.id});
      return res.status(201).json(productCategorySuccessRegistrationMsg(productCode.dataValues.code));
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
    const {currency} = req.params;
    const orders = JSON.parse(req.params.order);
    const currentUserId = req.user.id;
    try {
      const wallet = await findWallet(currentUserId);
      let amount = 0;
      let codes = {};
      orders.forEach((order) => {
        amount += order["price"] * order["quantity"];
      });
      console.log(wallet.dataValues[currency]);
      if (wallet.dataValues[currency] > 0 && wallet.dataValues[currency] >= amount) {
          for (const order of orders) {
          const id = order["id"];
          const quantity = order["quantity"];
          const label = order["label"];
          if (quantity !== 0) {
            const productCodes = await findAllProductCodes(
              quantity,
              id
            );
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
                  ([key, _]) => key !== "sold" && key !== "createdAt" &&  key !== "updatedAt" &&  key !== "ProductCategoryId"
                )
              )
            );
            productCodes.forEach(async product => {
              await updateProductCode(product.id)
            }) 
            if (productCodes.length < quantity) {
              await createCommand({
                category: label,
                quantity: quantity - productCodes.length,
                UserId: currentUserId,
              });
            }
          }
        }
        const newCredit = wallet.dataValues[currency] - amount;
        await updateWallet({ UserId: currentUserId, newCredit, currency });
        return res.status(200).json({ codes });
      } else {
        throw { message: "رصيدك غير كاف لإجراء هذه العملية" };
      }
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
