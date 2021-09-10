import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestProductID = await models.RequestProductID.create(body);
      resolve(requestProductID);
    } catch (err) {
      reject(err);
    }
  });
};

const findAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const RequestsProductID = await models.RequestProductID.findAll();
      resolve(RequestsProductID);
    } catch (err) {
      reject(err);
    }
  });
};

const find = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const RequestsProductID = await models.RequestProductID.findAll({
        where: { isTreated: false },
      });
      resolve(RequestsProductID);
    } catch (err) {
      reject(err);
    }
  });
};

const findById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestsProductID = await models.RequestProductID.findByPk(id);
      resolve(requestsProductID);
    } catch (err) {
      reject(err);
    }
  });
};

const updateIsTreated = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestProductID = await models.RequestProductID.update(
        { isTreated: true },
        {
          where: {
            id: _id,
          },
        }
      );
      console.log(requestProductID);
      resolve(requestProductID);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  findAll,
  find,
  findById,
  updateIsTreated,
};
