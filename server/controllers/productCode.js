import { createProductCode, findAllProductCodes } from "../models/query/productCode";
import { findServiceById } from "../models/query/service";
import { findProductCategoryById } from "../models/query/productCategory";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, productCategorySuccessRegistrationMsg } from '../utils/messages/productCategory'
import { saveCodes } from "./middleware/productCode";

export const addProductCode = (req, res) => {
   (async () => {
      const body = req.body
      try {
         const service = await findServiceById(body.ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(body.serviceName))
         }

         const productCategoryService = service.dataValues.ProductCategories.filter(ProductCategorieItem => ProductCategorieItem.dataValues.id === body.ProductCategoryId)
         if (productCategoryService.length === 0) {
            return res.status(401).json(productCategoryNotExistMsg(body.productCategoryName))
         }

         const productCategoryById = await findProductCategoryById(productCategoryService[0].dataValues.id)

         const isProductCodeExist = productCategoryById.dataValues.ProductCodes.filter(_productCode => _productCode.dataValues.code === body.code)
         if (isProductCodeExist.length !== 0) {
             return res.status(409).json(productCategoryAlreadyExistMsg(body.code))
         }

         const { productCode } = await createProductCode(body)
         const { code } = productCode.dataValues
         return res.status(201).json(productCategorySuccessRegistrationMsg(code))

      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const addMultiProductCode = (req, res) => {
   (async () => {
      const body = req.body
      const codes = req.dataObj
      try {
         const service = await findServiceById(body.ServiceId)
         if (service === null) {
            throw serviceNotExist(body.serviceName)
         }
         const message = await saveCodes(codes, body.serviceName, body.ServiceId)
         return res.status(201).json(message)

      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const getProductCodes = (req, res) => {
   (async () => {
      const categoryId = req.query.categoryId
      const quantity = req.query.quantity
      try {
         const productCodes = await findAllProductCodes(quantity, categoryId)
         res.status(200).json(productCodes)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}