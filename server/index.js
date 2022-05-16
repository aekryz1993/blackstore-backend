import app from "./app";
import { hostServer } from "./config/server.config";
import sequelize from "./config/db.config";
import http from "http";
import passport from "passport";
import apiRouter from "./routes";
import { Server } from "socket.io";
import redisConnect from "./config/redis";

const config = {
  host: hostServer(app)["host"],
  port: hostServer(app)["port"],
};

(async () => {
  try {
    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    const redisClient = redisConnect(io);

    app.use("/api", apiRouter(app, passport, io, redisClient, sequelize));

    httpServer.listen(config.port, config.host, () => {
      console.log(
        "Connection has been established successfully on port ",
        config.port
      );
    });
    httpServer.on("error", (err) => {
      throw err;
    });
  } catch (err) {
    console.error(err);
  }
})();
