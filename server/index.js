import app from "./app";
import { hostServer } from "./config/server.config";
import sequelize from "./config/db.config";
import http from "http";
import passport from "passport";
import apiRouter from "./routes";
//import { createAdapter } from "@socket.io/cluster-adapter";
//import { setupWorker } from "@socket.io/sticky";
import { Server } from "socket.io";
import redisConnect from "./config/redis";
//import SequelizeAdapter from "socket.io-adapter-sequelize";

const config = {
  host: hostServer(app)["host"],
  port: hostServer(app)["port"],
};

(async () => {
  try {
    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    //io.adapter(createAdapter());

    //setupWorker(io);

    //io.adapter(SequelizeAdapter(sequelize));

    const redisClient = redisConnect(io);

    app.use("/api", apiRouter(app, passport, io, redisClient, sequelize));

    httpServer.listen(config.port, () => {
      console.log(
        "Connection has been established successfully on port ",
        config.port
      );
    });
    httpServer.on("error", (err) => {
      throw err;
    });
    // await sequelize.sync();
    // await sequelize.authenticate();
    // createAdmin(redisClient);
  } catch (err) {
    console.error(err);
  }
})();
