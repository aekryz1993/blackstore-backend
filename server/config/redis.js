import { createClient } from "redis";

export default function redisConnect() {
  const client = createClient({
    password: config.password,
    socket: {
      host: config.host,
      port: config.port,
    },
  });
  (async () => {
    try {
      await client.connect();
      client.on("error", (err) => console.log("Redis Client Error", err));
    } catch (error) {
      console.log("Redis Client Error", error) 
    }
  })();
  return client;
}

const config = {
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USER || "default",
  password: process.env.REDIS_PASSWORD || 123456,
};
