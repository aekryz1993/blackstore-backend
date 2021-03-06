import priceQueries from "../../models/query/price";
import productCategoryQueries from "../../models/query/productCategory";
import productCodeQueries from "../../models/query/productCode";
import serviceQueries from "../../models/query/service";
import { serviceNotExist } from "../../utils/messages/service";

export const saveCodes = (codes, serviceName, ServiceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newCategories = [];
      for (let i in codes) {
        let codeInCategory = [];
        let productCategoryName;
        let ProductCategoryId;
        const label = codes[i]["Product"];
        const body = { label, serviceName, ServiceId };
        let category = await productCategoryQueries.find(label);
        if (category) {
          const service = await serviceQueries.findById(ServiceId, "code");
          if (service === null) {
            reject(serviceNotExist(serviceName));
          }

          const productCategoryInService = service.ProductCategories.filter(
            (ProductCategorieItem) =>
              ProductCategorieItem.dataValues.label ===
              category.dataValues.label
          );

          if (productCategoryInService === 0) {
            category = await productCategoryQueries.create(body);
            category = category.productCategory;
            await priceQueries.create({
              ProductCategoryId: category.dataValues.id,
            });
            const newcategory = await productCategoryQueries.findById(
              category.dataValues.id
            );
            newCategories.push(newcategory);
          } else {
            productCategoryName = category.dataValues.label;
            ProductCategoryId = category.dataValues.id;
          }
        } else {
          category = await productCategoryQueries.create(body);
          category = category.productCategory;
          await priceQueries.create({
            ProductCategoryId: category.dataValues.id,
          });
          const newcategory = await productCategoryQueries.findById(
            category.dataValues.id
          );
          newCategories.push(newcategory);
        }
        if (category.ProductCodes) {
          codeInCategory = category.ProductCodes.filter(
            (productCodeItem) =>
              productCodeItem.dataValues.code === String(codes[i]["PIN/Code"])
          );
        }

        if (codeInCategory.length === 0) {
          await productCodeQueries.create({
            code: String(codes[i]["PIN/Code"]),
            Serial: String(codes[i]["Serial"]),
            Date: String(codes[i]["Date"]),
            ProductCategoryId: category.dataValues.id,
          });
        }
      }
      resolve({
        message: "???? ?????????? ?????????????? ??????????",
        newCategories,
        success: true,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const saveCodesFromTxt = (codes, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existCodes = [];
      for (let code of codes) {
        const { created } = await productCodeQueries.findOrCreate({
          code,
          ProductCategoryId: categoryId,
        });
        if (!created) {
          existCodes.push(code);
        }
      }
      const message =
        existCodes.length === 0
          ? "The codes have been successfully added"
          : existCodes.length < codes.length
          ? "Some codes have been successfully added others are already existed"
          : "All these codes are already existed";
      resolve({
        message,
        existCodes,
        success: true,
      });
    } catch (error) {
      reject(error);
    }
  });
};
