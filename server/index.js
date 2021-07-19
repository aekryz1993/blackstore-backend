import http from 'http';

import app from './app';
import { hostServer } from './config/server.config';
import { createAdmin } from './db/seed';
import sequelize from './config/db.config'

const config = {
  host: hostServer(app)['host'],
  port: hostServer(app)['port'],
}

const server = http.createServer(app)

const listen = (port, host) => {
  return new Promise((resolve, reject) => {
    server.listen(port, host)
    server.on('listening', () => {
      resolve('successfully connected')
    })
    server.on('error', (err) => {
      reject(err)
      // switch (err.code) {
      //   case 'EADDRINUSE':
      //     reject(err.code)
      //     // listen(config.port + 1, config.host)
      //     break
      //   case 'EACCES':
      //     reject(err.code)
      //     // listen(1024, config.host)
      //     break
      //   case 'ENOTFOUND' || 'EADDRNOTAVAIL' || 'EAI_AGAIN':
      //     reject(err.code)
      // }
      // if (err.code === 'EADDRINUSE') listen(config.port + 1, config.host)
      // else if (err.code === 'EACCES') listen(1024, config.host)
      // else if (err.code === 'ENOTFOUND' || err.code === 'EADDRNOTAVAIL' || err.code === 'EAI_AGAIN') {
      //   throw err
      // }
    });
  })
}

(async () => {
  try {
    const result = await listen(config.port, config.host)
    console.log('Connection has been established successfully.');
    console.log(`Host: ${config.host}\nPort: ${config.port}`);
    console.log(result)
    await sequelize.sync()
    createAdmin()
  } catch (err) {
    console.log(err)
    if (err.code === '3D000') {
    }
  }
})()

export default listen