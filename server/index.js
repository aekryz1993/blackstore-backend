import app from "./app";
import { hostServer } from "./config/server.config";
import { createAdmin } from "./db/seed";
import sequelize from "./config/db.config";
import http from "http";
import passport from "passport";
import apiRouter from "./routes";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";
import { Server } from "socket.io";
import redisConnect from "./config/redis";
import SequelizeAdapter from "socket.io-adapter-sequelize";
import { createAdapter as createRedisAdapter } from "@socket.io/redis-adapter";

const config = {
  host: hostServer(app)["host"],
  port: hostServer(app)["port"],
};

(async () => {
  try {
    const redisClient = redisConnect();
    const httpServer = http.createServer(app);
    const io = new Server(httpServer);
    //const io = app.io;
    //io.attach(httpServer);
    io.adapter(createAdapter());
    io.adapter(SequelizeAdapter(sequelize));
    const subClient = redisClient.duplicate();
    io.adapter(createRedisAdapter(redisClient, subClient));
    setupWorker(io);

    app.use("/api", apiRouter(app, passport, io, redisClient));

    httpServer.listen(config.port, () => {
      console.log(
        "Connection has been established successfully on port ",
        config.port
      );
    });
    httpServer.on("error", (err) => {
      throw err;
    });
    await sequelize.sync();
    await sequelize.authenticate();
    createAdmin(redisClient);
  } catch (err) {
    console.error(err);
  }
})();
