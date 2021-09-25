import app, { redisClient } from "./app";
import { hostServer } from "./config/server.config";
import { createAdmin } from "./db/seed";
import sequelize from "./config/db.config";
import http from "http";

const config = {
  host: hostServer(app)["host"],
  port: hostServer(app)["port"],
};

(async () => {
  try {
    const server = http.createServer(app);
    const io = app.io;
    io.attach(server);
    server.listen(config.port || 5000, () => {
      console.log('Connection has been established successfully on port ', config.port);
    });
    server.on("error", (err) => {
      throw err;
    });
    await sequelize.sync();
    await sequelize.authenticate();
    createAdmin(redisClient);
  } catch (err) {
    console.error(err);
  }
})();
