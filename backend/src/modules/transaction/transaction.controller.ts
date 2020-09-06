import { Request, Response, Router } from "express";

import * as Interfaces from "interfaces";
import { Responses } from "../../helpers";
import { requestDecrypt } from "../../middlewares";

import Transaction from "./transaction.model";


class TransactionController implements Interfaces.Controller {
    public path = '/Transaction';
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }

    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)

            .get(
                this.path + "/getAll/:userAddress",
                this.getAll
            )
            .get(
                this.path + "/registeredPerDay",
                this.registeredPerDay
            )
            .get(
                this.path + "/getTotal",
                this.getTotal
            )
            .get(
                this.path + "/getEURValue",
                this.getEURValue
            )
            .get(
                this.path + "/userIncome",
                this.getUserIncomeLog
            )
            .get(
                this.path + "/reinvest",
                this.getReinvestLog
            )
            .get(
                this.path + "/addMissingTransaction/:userAddress",
                this.addMissingTransaction
            )
            .post(
                this.path + "/add",
                requestDecrypt,
                this.add
            );
    }

    //Get Transactions
    private async getAll(req: any, response: Response) {
        const { userAddress } = req.params;
        if (userAddress) {
            try {
                const records: any = await Transaction.getAll(userAddress, req.query);
                if (records.status) {
                    return Responses.success(response, { status: true, data: records.data });
                } else {
                    return Responses.success(response, { status: false, message: records.message });
                }
            } catch (error) {
                return Responses.error(response, { message: error });
            }
        }
    }
    //Get Transactions
    private async addMissingTransaction(req: any, response: Response) {
        const { userAddress } = req.params;
        if (userAddress) {
            try {
                const records: any = await Transaction.addMissingTransaction(userAddress);
                if (records.status) {
                    return Responses.success(response, { status: true, data: records.data });
                } else {
                    return Responses.success(response, { status: false, message: records.message });
                }
            } catch (error) {
                return Responses.error(response, { message: error });
            }
        }
    }
    //Get Transactions
    private async registeredPerDay(req: any, response: Response) {
        try {
            let records: any = await Transaction.totalRegistrationPerDay();
            if (records > 0) {
                return Responses.success(response, records.toString());
            } else {
                return Responses.success(response, "0");
            }
        } catch (error) {
            return Responses.error(response, { message: error });
        }
    }
    //Get Transactions Total
    private async getTotal(req: any, response: Response) {
        try {
            // const records: any = await Transaction.getTotal();
            const records: any = await Transaction.getTotalLogs();

            return Responses.success(response, records);
        } catch (error) {
            console.log(error, 'total income error');
            return Responses.error(response, { message: error });
        }
    }
    //Get Transactions User Income Log
    private async getUserIncomeLog(req: any, response: Response) {
        try {
            const records: any = await Transaction.userIncomeLog();

            return Responses.success(response, records);
        } catch (error) {
            return Responses.error(response, { message: error });
        }
    }
    //Get Transactions Reinvest Income log
    private async getReinvestLog(req: any, response: Response) {
        try {
            const records: any = await Transaction.reinvestLog();

            return Responses.success(response, records);
        } catch (error) {
            return Responses.error(response, { message: error });
        }
    }

    // Transaction add
    private async add(req: any, response: Response) {
        try {
            const { userAddress, } = req.body;

            if (!userAddress) {
                const err: any = new Error('User Address is a required argument');
                err.statusCode = 400;
                return Responses.error(response, err);
            }
            const result: any = await Transaction.add(req.body);
            if (result.status) {
                return Responses.success(response, { status: true });
            } else {
                return Responses.error(response, { status: false, message: result.message });
            }
        } catch (error) {
            return Responses.error(response, error);
        }
    }
    // get EUR value
    private async getEURValue(req: any, response: Response) {
        try {
            const eur = await Transaction.getEUR();
            return Responses.success(response, { status: true, eur });
        } catch (error) {
            return Responses.error(response, error);
        }
    }
}

export default TransactionController;