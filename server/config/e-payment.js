import coinbase from "coinbase-commerce-node";

const Client = coinbase.Client;

export default function ePayment() {
  Client.init(process.env.COINBASE_API_KEY);
  const coinbaseResources = coinbase.resources;

  return {
    coinbaseResources,
  };
}
