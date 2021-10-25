import { createClient } from "redis";
import redisAdapter from '@socket.io/redis-adapter';

export default function redisConnect(io) {
  const client = createClient({
    password: config.password,
    socket: {
      host: config.host,
      port: config.port,
    },
  });

  (async () => {
    const subClient = client.duplicate();
    subClient.psubscribe = subClient.pSubscribe;
    io.adapter(redisAdapter(client, subClient));
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
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || 123456,
};
