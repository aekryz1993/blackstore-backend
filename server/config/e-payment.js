import {Client, resources} from "coinbase-commerce-node";
import libTypedarrays from "crypto-js/lib-typedarrays";
import hmacSHA512 from "crypto-js/hmac-sha512";

export const coinBaseConfig = (id) => {
  const {COINBASE_API_KEY} = process.env;
  
  Client.init(COINBASE_API_KEY);

  const orderQueryUrl = id ? `https://api.commerce.coinbase.com/charges/${id}` : '';

  const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": COINBASE_API_KEY,
        "X-CC-Version": "2018-03-22",
      },
  };
  return {
    resources,
    orderQueryUrl,
    requestOptions,
  };
}

export const binanceConfig = ({body}) => {
  const { BINANCE_API_KEY, BINANCE_SECRET_KEY } = process.env;
  const timestamp = Date.now();
  const nonce = libTypedarrays.random(128 / 8).toString();

  const payload_to_sign =
    timestamp + "\n" + nonce + "\n" + JSON.stringify(body) + "\n";
    const signature = hmacSHA512(payload_to_sign, BINANCE_SECRET_KEY)
      .toString()
      .toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    "BinancePay-Timestamp": timestamp,
    "BinancePay-Nonce": nonce,
    "BinancePay-Certificate-SN": BINANCE_API_KEY,
    "BinancePay-Signature": signature,
  },

  const requestOptions = {
    headers,
  };

  const orderUrl = "https://bpay.binanceapi.com/binancepay/openapi/order"
  const orderQueryUrl = "https://bpay.binanceapi.com/binancepay/openapi/order/query"

  return {
    requestOptions,
    orderUrl,
    orderQueryUrl,
  }
}