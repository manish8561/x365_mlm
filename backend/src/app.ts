import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import * as fs from "fs";
import * as path from "path";
import { CronJob } from 'cron';

import swaggerUi from 'swagger-ui-express';
import * as http from "http";
import * as swaggerDocument from './swagger.json';
import * as  socketio from 'socket.io';

// import * as config from "../src/config/";
import { Controller } from "./interfaces";
import { errorMiddleware } from "./middlewares";
import Transaction from "../src/modules/transaction/transaction.model";

class App {
    public app: express.Application;
    public port: any;
    private server: http.Server;
    private io: socketio.Server;
    constructor(controllers: Controller[]) {
        this.app = express();
        this.port = process.env.PORT ? process.env.PORT : 8082;
        //socket io code
        this.server = http.createServer(this.app);
        this.io = socketio.listen(this.server, { origins: '*:*' });

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }



    public listen() {
        // this.app.listen(this.port, () => {
        //     console.log("Running server on port %s", this.port);
        // });
        this.server.listen(this.port, () => {
            console.log(
                `-- App listening on the port ${
                this.port
                }`
            );
        });
        this.io.on("connection", (socket: any) => {
            console.log("Connected client on port %s.", this.port);
            // calling function from transaction model
            Transaction.getApiAndEmit(socket);
            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });

        return this.server;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(helmet());

        // setup the logger
        this.saveLogs();
        //setting up swagger
        // this.useSwagger();
        this.startCron();
    }

    private useSwagger() {
        const enable_swagger = process.env.ENABLE_SWAGGER == 'true' ? true : false;
        if (enable_swagger) {
            this.app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
            // this.app.use('/explorer', swaggerUi.serve);
            // this.app.get('/explorer', swaggerUi.setup(swaggerDocument));
        }
    }


    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use("/api", controller.router);
        });
        this.app.get("/app/status", (req, res) => {
            return res.status(200).send({ status: "success" });
        });
    }
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    private saveLogs() {
        console.log('\n inside savelogs ------ ');
        const logDirectory = path.join(__dirname, "log");
        // ensure log directory exists
        const exists = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
        if (exists) {
            const accessLogStream = rfs.createStream("access.log", {
                // size: "10M", // rotate every 10 MegaBytes written
                interval: "1d", // rotate daily
                path: logDirectory,
                // compress: "gzip" // compress rotated files
            });

            // setup the logger
            this.app.use(morgan("combined", { stream: accessLogStream }));
        }
    }

    private startCron() {
        const job = new CronJob('0 0 */12 * * *', function () {
            console.log('You will see this message every 15 minute' + new Date());
            Transaction.updateEUR();
        }, null, true, 'America/Los_Angeles');
        job.start();
    }

}
export default App;
