import cluster from "cluster";
import os from "os";

import App from "./app";
import Controllers from "./modules";
// import * as config from "./config";

// // Loading Config
// (async () => {
//     await config.initiate();
// })();


const clusterEnable = process.env.CLUSTER === "false" ? false : true;
if (cluster.isMaster && clusterEnable) {
    const numWorkers = os.cpus().length;
    for (let i: number = 0; i < numWorkers; i += 1) {
        cluster.fork();
    }
    cluster.on("online", worker => {
        console.log("Worker " + worker.process.pid + " is online");
    });

    cluster.on("exit", (worker, code, signal) => {
        console.log(
            "Worker " +
            worker.process.pid +
            " died with code: " +
            code +
            ", and signal: " +
            signal
        );
        console.log("Starting a new worker");
        cluster.fork();
    });
} else {
    //without cluster
    const app = new App(Controllers);
    app.listen();
}