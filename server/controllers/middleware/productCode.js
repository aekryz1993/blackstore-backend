import path from "path"

import { createPicture } from "../../models/query/image";
import { createProductCategory, findProductCategory } from "../../models/query/productCategory";
import { createProductCode } from "../../models/query/productCode";
import { findServiceById } from "../../models/query/service";
import { serviceNotExist } from "../../utils/messages/service";

const CURRENT_WORKING_DIR = process.cwd();

export const saveCodes = (codes, serviceName, ServiceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i in codes) {
                let codeInCategory = []
                let productCategoryName
                let ProductCategoryId
                const label = codes[i]["Product"]
                const body = {label, serviceName, ServiceId}
                let category = await findProductCategory(label)
                if (category) {
                    const service = await findServiceById(ServiceId)
                    if (service === null) {
                        reject(serviceNotExist(serviceName))
                    }

                    const productCategoryInService = service.ProductCategories.filter(
                        ProductCategorieItem => ProductCategorieItem.dataValues.label === category.dataValues.label
                    )
                    
                    if (productCategoryInService === 0) {
                        category = await createProductCategory(body)
                        category = category.productCategory
                        const imageBody = {
                            type: 'image/png',
                            name: `default.png`,
                            url: path.resolve(CURRENT_WORKING_DIR, `resource/static/assets/pictures/prodectCategory/default.png`),
                            ProductCategoryId: category.dataValues.id,
                        }
                        await createPicture(imageBody)
                    } else {
                        productCategoryName = category.dataValues.label
                        ProductCategoryId = category.dataValues.id
                    }
                } else {
                    category = await createProductCategory(body)
                    category = category.productCategory
                    const imageBody = {
                        type: 'image/png',
                        name: `default.png`,
                        url: path.resolve(CURRENT_WORKING_DIR, `resource/static/assets/pictures/prodectCategory/default.png`),
                        ProductCategoryId: category.dataValues.id,
                    }
                    await createPicture(imageBody)
                }
                if (category.ProductCodes) {
                    codeInCategory = category.ProductCodes.filter(
                        productCodeItem => productCodeItem.dataValues.code === String(codes[i]['PIN/Code']))
                }
                
                if (codeInCategory.length === 0) {
                    await createProductCode({
                        code: String(codes[i]['PIN/Code']),
                        Serial: String(codes[i]['Serial']),
                        Date: String(codes[i]['Date']),
                        isAvailable: true,
                        serviceName: serviceName,
                        ServiceId: ServiceId,
                        productCategoryName: category.dataValues.label,
                        ProductCategoryId: category.dataValues.id,
                    })
                }
            }
            resolve({message: 'تم إضافة الأكواد بنجاح'})
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}