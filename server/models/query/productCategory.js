import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCategory = await models.ProductCategory.create(body, {
        include: [models.ProductCode, models.Price],
      });
      resolve({ productCategory });
    } catch (err) {
      reject(err);
    }
  });
};

const find = (label) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCategory = await models.ProductCategory.findOne({
        where: { label },
        include: [models.ProductCode, models.Price],
      });
      resolve(productCategory);
    } catch (err) {
      reject(err);
    }
  });
};

const findAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCategory = await models.ProductCategory.findAll();
      resolve(productCategory);
    } catch (err) {
      reject(err);
    }
  });
};

const findById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCategory = await models.ProductCategory.findByPk(id, {
        include: [models.ProductCode, models.Price],
      });
      resolve(productCategory);
    } catch (err) {
      reject(err);
    }
  });
};

const updatePrice = ({ id, priceCoin, pricePoint }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await models.ProductCategory.update(
        { priceCoin, pricePoint },
        {
          where: { id },
        }
      );
      resolve({ message: "تم تحديث السعر بنجاح" });
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  find,
  findAll,
  findById,
  updatePrice,
};
