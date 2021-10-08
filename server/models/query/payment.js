import models from "../associations";

const find = (codeID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.findOne({
        where: {
          codeID,
        },
      });
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  });
};

const updateConfirmed = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.findAndUpdate(
        { confirmed: true },
        {
          where: { id },
        }
      );
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  });
};

const update = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.findAndUpdate(
        { status },
        {
          where: { id },
        }
      );
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  });
};

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.create(body);
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  });
};

const getNotConfirmed = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = await models.Payment.findAll({
        where: { confirmed: false },
      });
      resolve(payments);
    } catch (err) {
      reject(err);
    }
  });
};

const getConfirmed = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = await models.Payment.findAll({
        where: { confirmed: true },
      });
      resolve(payments);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  find,
  updateConfirmed,
  create,
  update,
  getNotConfirmed,
  getConfirmed,
};
