import productCodeQueries from "../models/query/productCode";
import userQueries from "../models/query/user";
import serviceQueries from "../models/query/service";
import productCategoryQueries from "../models/query/productCategory";
import walletQueries from "../models/query/wallet";
import commandQueries from "../models/query/command";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from "../utils/messages/service";
import {
  productCategoryAlreadyExistMsg,
  productCategoryNotExistMsg,
  productCategorySuccessRegistrationMsg,
} from "../utils/messages/productCategory";
import { saveCodes } from "./middleware/productCode";
import { writeExcel } from "./middleware/excel";
import { dataFormat } from "../helpers/excel";

export const addProductCode = (req, res) => {
  (async () => {
    const { serviceName, productName, code, Date, Serial } = req.body;
    try {
      const service = await serviceQueries.find(serviceName, "code");
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

      const productCategory = await productCategoryQueries.findById(
        productCategoryService[0].dataValues.id
      );

      const isProductCodeExist = productCategory.dataValues.ProductCodes.filter(
        (_productCode) => _productCode.dataValues.code === code
      );
      if (isProductCodeExist.length !== 0) {
        return res.status(409).json(productCategoryAlreadyExistMsg(code));
      }

      const { productCode } = await productCodeQueries.create({
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
      if (!codes) {
        return res.status(400).json({ message: "You should upload a file" });
      }
      const service = await serviceQueries.findById(body.ServiceId);
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

export const getProductCodesByMultCategories = (orderCommandNamespace) => (req, res) => {
  (async () => {
    const { currency, amount, serviceName } = req.params;
    const orders = JSON.parse(req.params.order);
    const currentUserId = req.user.id;
    try {
      const admins = await userQueries.findAdmins();
      const wallet = await walletQueries.find(currentUserId);
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
            const productCodes = await productCodeQueries.findAll(quantity, id);
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
                    key !== "CommandId" &&
                    key !== "UserId"
                )
              )
            );
            productCodes.forEach(async (product) => {
              await productCodeQueries.update(product.id, currentUserId);
            });
            const productCategory = await productCategoryQueries.find(label);
            console.log((productCategory.dataValues.id))
            if (productCodes.length < quantity) {
              const newCommand = await commandQueries.create({
                category: label,
                quantity: quantity - productCodes.length,
                serviceName,
                UserId: currentUserId,
                ProductCategoryId: productCategory.dataValues.id,
              });
              admins.forEach(admin => orderCommandNamespace.to(admin.dataValues.id).emit('send_command_order', newCommand));
              commands = [...commands, newCommand];
            }
          }
        }
        const newCredit = wallet.dataValues[currency] - amount;
        await walletQueries.update({ UserId: currentUserId, newCredit, currency });
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
      return res.status(401).json(serverErrorMessage(err.message));
    }
  })();
};