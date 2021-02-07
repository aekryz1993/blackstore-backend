export const fixPort = (port) => {
    if (!(port >= 1024 && port < 65535)) port = 1024
    return port
}