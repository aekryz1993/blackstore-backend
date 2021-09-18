import { createClient } from "redis";

export default function redisConnect() {
  const client = createClient({
    socket: {
      url: `redis://${config.username}:${config.password}@${config.host}:${config.port}`,
    },
    // host: config.host,
    // port: config.port,
    // username: config.username,
    // password: config.password,
  });
  (async () => {
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
  })();
  return client;
}

const config = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USER || "default",
  password: process.env.REDIS_PASSWORD || 123456,
};
