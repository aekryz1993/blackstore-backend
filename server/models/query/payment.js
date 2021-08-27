import models from '../associations'

export const findPayment = (codeID) => {
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

export const updatePaymentStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await models.Payment.findAndUpdate({confirmed: true}, {
          where: {id}
      });
      resolve(payment);
    } catch (err) {
      reject(err);
    }
  });
};

export const createPayment = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payment = await models.Payment.create(body)
            resolve(payment)
        } catch (err) {
            reject(err)
        }
    })
}

export const getNotConfirmedPayments = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const payments = await models.Payment.findAll({
                where: {confirmed: false}
            })
            resolve(payments)
        } catch (err) {
            reject(err)
        }
    })
}

export const getConfirmedPayments = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const payments = await models.Payment.findAll({
                where: {confirmed: true}
            })
            resolve(payments)
        } catch (err) {
            reject(err)
        }
    })
}
