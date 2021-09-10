import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await models.Price.create(body);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const update = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const price = await models.Price.update(body, {
        where: { id },
      });
      if (price[0] === 0) {
        reject({ message: "this product doesn't exist" });
      }
      resolve({ message: "تم تحديث السعر بنجاح" });
    } catch (err) {
      reject(err);
    }
  });
};

const findByProduct = (ProdId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const price = await models.Price.findOne({
        where: { ProductCategoryId: ProdId },
      });
      resolve(price);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  update,
  findByProduct,
};
