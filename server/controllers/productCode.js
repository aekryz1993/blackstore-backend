import {
  createProductCode,
  findAllProductCodes,
  updateProductCode,
} from "../models/query/productCode";
import { findServiceById } from "../models/query/service";
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
    const body = req.body;
    try {
      const service = await findServiceById(body.ServiceId);
      if (service === null) {
        return res.status(401).json(serviceNotExist(body.serviceName));
      }

      const productCategoryService =
        service.dataValues.ProductCategories.filter(
          (ProductCategorieItem) =>
            ProductCategorieItem.dataValues.id === body.ProductCategoryId
        );
      if (productCategoryService.length === 0) {
        return res
          .status(401)
          .json(productCategoryNotExistMsg(body.productCategoryName));
      }

      const productCategoryById = await findProductCategoryById(
        productCategoryService[0].dataValues.id
      );

      const isProductCodeExist =
        productCategoryById.dataValues.ProductCodes.filter(
          (_productCode) => _productCode.dataValues.code === body.code
        );
      if (isProductCodeExist.length !== 0) {
        return res.status(409).json(productCategoryAlreadyExistMsg(body.code));
      }

      const { productCode } = await createProductCode(body);
      const { code } = productCode.dataValues;
      return res.status(201).json(productCategorySuccessRegistrationMsg(code));
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
    let categories = []
    req.query.categories.split('\\').forEach(category => {
      categories.push(JSON.parse(category))
    })
    const currentUserId = req.user.id;
    try {
      const wallet = await findWallet(currentUserId);
      let amount = 0;
      let codes = {};
      categories.forEach((category) => {
        amount += category["price"] * category["quantity"];
      });
      if (wallet.dataValues.credit >= amount) {
        categories.forEach(async (category) => {
          const categoryId = category["id"];
          const quantity = category["quantity"];
          const label = category["label"];
          if (quantity !== 0) {
            const productCodes = await findAllProductCodes(
              quantity,
              categoryId
            );
            codes[label] = productCodes;
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
        });
        const newCredit = wallet.dataValues.credit - amount;
        await updateWallet({ UserId: currentUserId, newCredit });
        return res.status(200).json({ codes });
      } else {
        throw { message: "رصيدك غير كاف لإجراء هذه العملية" };
      }
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
