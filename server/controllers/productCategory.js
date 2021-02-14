import { createProductCategory } from "../models/query/productCategory";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategorySuccessRegistrationMsg } from '../utils/messages/productCategory'

export const addProductCategory = (req, res) => {
   (async () => {
      const body = req.body
      try {
         const service = await findServiceById(body.serviceId)

         if (service === null) {
            return res.status(401).json(serviceNotExist(body.serviceName))
         }

         const checkExistCategory = service.dataValues.ProductCategories.filter(ProductCategorieItem => ProductCategorieItem.dataValues.label === body.label)

         if (checkExistCategory.length !== 0) {
            return res.status(409).json(productCategoryAlreadyExistMsg(body.label))
         }

         const { productCategory } = await createProductCategory(body)

         const { label } = productCategory.dataValues
         
         return res.status(201).json(productCategorySuccessRegistrationMsg(label))

      } catch (err) {
         console.log(err)
         return res.json(serverErrorMessage());
      }
   })()
}