import { createProductCode } from "../models/query/productCode";
import { findServiceById } from "../models/query/service";
import { findProductCategoryById } from "../models/query/productCategory";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, productCategorySuccessRegistrationMsg } from '../utils/messages/productCategory'

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
         console.log(err)
         return res.json(serverErrorMessage());
      }
   })()
}