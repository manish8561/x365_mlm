import { Request, Response, Router } from "express";
import { Parser } from 'json2csv';

import * as Interfaces from "interfaces";
import { Responses } from "../../helpers";

import Account from "./account.model";

class AccountController implements Interfaces.Controller {
    public path = '/Account';
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }

    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .get(
                this.path + "/getAll",
                this.getAccounts
            )
            .get(
                this.path + "/totalParticipants",
                this.totalParticipants
            )
            .get(
                this.path + "/eventlog",
                this.eventLog
            )
            // .post(
            //     this.path + "/resetPassword",
            //     this.resetPassword
            // )
            ;
    }

    //user pool update
    private async totalParticipants(req: any, response: Response) {
        try {
            const records: any = await Account.totalParticipants();
            if (records) {
                return Responses.success(response, records.toString());
            } else {
                return Responses.success(response, 0);
            }
        } catch (error) {
            return Responses.error(response, error);
        }
    }
    //get event log
    private async eventLog(req: any, response: Response) {
        try {
            const records: any = await Account.eventLog();
            if (records) {
                const json2csv = new Parser({});
                const csv = await json2csv.parse(records);
                response.header('Content-Type', 'text/csv');
                response.attachment('event.csv');
                return response.status(200).send(csv);
            } else {
                return Responses.success(response, []);
            }
        } catch (error) {
            return Responses.error(response, error);
        }
    }

    //Get Accounts
    private async getAccounts(req: any, response: Response) {
        const skipNum = parseInt(req.query.skipNum) || 0;

        return Responses.success(response, 'Ok');
    }
}

export default AccountController;