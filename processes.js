module.exports = {
    apps: [
        {
            script: "./dist/main.js",
            merge_logs: true,
            instances: "max",
            exec_mode: "cluster",
     	}
    ]
}
