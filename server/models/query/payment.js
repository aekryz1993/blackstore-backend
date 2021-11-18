import models from "../associations";

const create = (body) => {
  return new Promise((resolve, reject) => {
    try {
      const payment = models.Payment.create(body)
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  })
}

const find = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.findOne({
        where: {
          orderId,
        },
      });
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  });
};

const findByUserAndCurrency = ({currency, UserId, limit, offset}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = await models.Payment.findAll({
        offset,
        limit,
        where: {
          currency,
          UserId,
        },
      });
      resolve(payments);
    } catch (err) {
      reject(err);
    }
  });
};

const count = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalPayments = await models.Payment.count({
        where: { ...props },
      });
      resolve(totalPayments);
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

const updateStatus = ({orderId, status, confirmed}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.findAndUpdate(
        { status, confirmed },
        {
          where: { orderId },
        }
      );
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
  create,
  find,
  findByUserAndCurrency,
  count,
  updateConfirmed,
  updateStatus,
  getNotConfirmed,
  getConfirmed,
};
