module.exports = {
    apps: [
        {
	    name: "blue-store-server",
            script: "./dist/main.js",
            merge_logs: true,
            instances: "max",
	    exec_mode: "cluster",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
}
