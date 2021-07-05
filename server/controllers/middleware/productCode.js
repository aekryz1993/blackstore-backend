import { createProductCategory, findProductCategory, findProductCategoryById } from "../../models/query/productCategory";
import { createProductCode } from "../../models/query/productCode";

export const saveCodes = (codes, service) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i in codes) {
                let productCategoryName
                let ProductCategoryId
                const label = codes[i]["Product"]
                const serviceName = service.label
                const ServiceId = service.id
                const body = {label, serviceName: serviceName, ServiceId}
                let category = await findProductCategory(label)
                if (category) {
                    const productCategoryInService = service.ProductCategories.filter(
                        ProductCategorieItem => ProductCategorieItem.dataValues.label === category.dataValues.label
                    )
                    if (!productCategoryInService) {
                        category = await createProductCategory(body)
                        productCategoryName = category.productCategory.dataValues.label
                        ProductCategoryId = category.productCategory.dataValues.id
                    } else {
                        productCategoryName = category.dataValues.label
                        ProductCategoryId = category.dataValues.id
                    }
                } else {
                    // if (!(label in treatedCategories)) {
                    category = await createProductCategory(body)
                    productCategoryName = category.productCategory.dataValues.label
                    ProductCategoryId = category.productCategory.dataValues.id
                        // treatedCategories = {...treatedCategories, [label]: category.productCategory.dataValues.id}
                    // } else {
                        // const categoryId = treatedCategories[label]
                        // category = await findProductCategoryById(categoryId)
                        // console.log(category)
                    // }
                }
                await createProductCode({
                    code: codes[i]['PIN/Code'],
                    Serial: codes[i]['Serial'],
                    Date: codes[i]['Date'],
                    isAvailable: true,
                    serviceName: serviceName,
                    ServiceId: ServiceId,
                    productCategoryName,
                    ProductCategoryId
                })
                // } catch (error) {
                //     // throw error.message
                //     reject(error)
                // }
            }
            // codes.map(async (code, idx) => {
                
            // });
            resolve({message: 'تم إضافة الأكواد بنجاح'})
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}