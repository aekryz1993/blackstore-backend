import {fixPort} from './helper'

export const devHostServer = {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 5000
};

export const testHostServer = {
    host: process.env.HOST || '127.0.0.1',
    port: Number(process.env.PORT) || 5000
};

export const prodHostServer = {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 5000
};

export const hostServer = (app) => app.get('env') === 'development' ? devHostServer : prodHostServer;

export const baseUrl = (app) => app.get('env') === 'development' ? `http://${devHostServer.host}:${devHostServer.port}` : `http://${prodHostServer.host}`;