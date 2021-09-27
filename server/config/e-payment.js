import {Client, resources} from "coinbase-commerce-node";

export default function ePayment() {
  Client.init(process.env.COINBASE_API_KEY);
  return {
    resources,
  };
}
