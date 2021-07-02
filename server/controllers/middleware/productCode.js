import { createProductCategory } from "../../models/query/productCategory";
import { createProductCode } from "../../models/query/productCode";

export const saveCodes = (codes, service) => {
    return Promise(async (resolve, reject) => {
        codes.forEach(async code => {
            try {
                const label = code["Product"]
                const serviceName = service.label
                const ServiceId = service.id
                const body = {label, serviceName: serviceName, ServiceId}
                let category = await findProductCategory(serviceName)
                if (!category) {
                    category = await createProductCategory(body)
                } else {
                    const productCategoryService = service.ProductCategories.filter(
                            ProductCategorieItem => ProductCategorieItem.dataValues.id === category.dataValues.id
                        )
                    if (!productCategoryService) {
                        category = await createProductCategory(body)
                    }
                }
                productCodeBody = {
                    code: codes['PIN/Code'],
                    isAvailable: true,
                    serviceName: serviceName,
                    ServiceId: ServiceId,
                    productCategoryName: category.dataValues.label,
                    ProductCategoryId: category.dataValues.id,
                }
                await createProductCode(productCodeBody)
            } catch (error) {
                reject(error.message)
            }
        });
        resolve({message: 'تم إضافة الأكواد بنجاح'})
    })
}