
import app, {redisClient} from './app';
import { hostServer } from './config/server.config';
import { createAdmin } from './db/seed';
import sequelize from './config/db.config'
import http from "http";

const config = {
  host: hostServer(app)['host'],
  port: hostServer(app)['port'],
}

const listen = (port, host) => {
  const server = http.createServer(app);
  const io = app.io;
  io.attach(server);
  return new Promise((resolve, reject) => {
    server.listen(port, host)
    server.on('listening', () => {
      resolve({message:'Connection has been established successfully.', port, host})
    })
    server.on('error', (err) => {
      server.close()
      if (err.code === 'EADDRINUSE') resolve(listen(err.port + 1, config.host))
    });
  })
}

(async () => {
  try {
    const result = await listen(config.port, config.host)
    console.log(result.message);
    console.log(`Host: ${result.host}\nPort: ${result.port}`);
    await sequelize.sync()
    createAdmin(redisClient)
  } catch (err) {
    console.error(err)
  }
})()

export default listen