import { createProductCategory } from "../models/query/productCategory";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg } from '../utils/messages/productCategory'

export const addProductCategory = (req, res, next) => {
   (async () => {
      const body = req.body
      try {
         const service = await findServiceById(body.ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(body.serviceName))
         }

         const checkExistCategory = service.dataValues.ProductCategories.filter(ProductCategorieItem => ProductCategorieItem.dataValues.label === body.label)
         if (checkExistCategory.length !== 0) {
            return res.status(409).json(productCategoryAlreadyExistMsg(body.label))
         }

         const { productCategory } = await createProductCategory(body)
         req.body.associatedModelId = productCategory.dataValues.id
         req.body.associatedModel = 'ProductCategoryId'
         req.body.label = productCategory.dataValues.label
         return next()

      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}