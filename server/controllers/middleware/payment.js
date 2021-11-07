import { coinBaseConfig } from "../../config/e-payment";

export const fetchBinanceOrder = (merchantTradeNo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = { merchantTradeNo };

      const config = binanceConfig({ body });

      const response = await axios.post(
        config.orderQueryUrl,
        JSON.stringify(body),
        requestOptions
      );

      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const fetchCoinbaseOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = coinBaseConfig(orderId);

      let response = await axios.get(
        config.orderQueryUrl,
        config.requestOptions,
      );

      resolve(response.data)
    } catch (error) {
      reject(error);
    }
  });
};
