import fs from "fs"

import { createProductCategory, updatePrice } from "../models/query/productCategory";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg } from '../utils/messages/productCategory'
import { unlink } from 'fs';
import { savePrices } from "./middleware/productCategory";
import { findImage } from "../models/query/image";

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
            if (req.file) {
               unlink(req.file.path, (err) => {
                  if (err) throw err;
               });
            }
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

export const updatePriceProductCategory = (req, res) => {
   (async () => {
      const body = req.body
      try {
         const service = await findServiceById(body.ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(body.serviceName))
         }
         const productCategory = service.ProductCategories.filter(
             ProductCategorieItem => ProductCategorieItem.dataValues.id === body.id
         )
         if (productCategory.length !== 0) {
            const message = await updatePrice({id: body.id, priceCoin: body.priceCoin, pricePoint: body.pricePoint})
            return res.status(200).json({message})
         } 
         return res.status(401).json(serviceNotExist('this category doesn\'t exist'))
      } catch (err) {
         console.log(err)
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const updateMultiPricesProductCategory = (req, res) => {
   (async () => {
      const {ServiceId, serviceName} = req.body
      const prices = req.dataObj
      try {
         const message = await savePrices(prices, ServiceId, serviceName)
         return res.status(200).json(message)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const fetchProductCategoriessByService = (req, res) => {
   (async () => {
      const {ServiceId, serviceName} = req.query
      try {
         const service = await findServiceById(ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }
         return res.status(200).json(service.ProductCategories)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const updateCategoryPicture = (req, res, next) => {
    (async () => {
      try {
        const {id, label} = req.body
        const image = await findImage(id)
        const currentImageUrl = image.dataValues.url
        await image.destroy()
        if (!currentImageUrl.endsWith('default.png')) {
          fs.unlink(currentImageUrl, (err) => {
            if (err) throw err
          })
        }
        req.body.associatedModelId = id
        req.body.associatedModel = 'ProductCategoryId'
        req.body.label = label

        next()
      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}