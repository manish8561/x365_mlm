// import * as SqlString from "sqlstring";
import BaseModel from '../../model/base.model';

import { API_MSG } from "../../constant/response";

import Web3 from 'web3';


const myContract = require('../../bin/myContractABI.json');
// const myContractLive = require('../../bin/myContractLive.json');


class Account extends BaseModel {
    // public INFURA_API = 'https://rinkeby.infura.io/v3/8383baf95e53485a914dbf9f99514a3f';
    // public INFURA_API = 'https://mainnet.infura.io/v3/8383baf95e53485a914dbf9f99514a3f';
    public INFURA_API = process.env.INFURA_API!;
    public web3: Web3;
    public myContractOb: any;
    //public INFURA_API_LIVE = 'https://3.21.162.137:8546';
    public contractAddress = process.env.CONTRACT_ADDRESS;

    constructor() {
        super();
        this.web3 = new Web3(this.INFURA_API);
        // this.web3 = new Web3('http://52.52.96.207:8545');
        this.myContractOb = new this.web3.eth.Contract(myContract, this.contractAddress);
    }
    // public async UserPoolIncome(address: string) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const web3 = new Web3(this.INFURA_API_LIVE);
    //             const contract = new web3.eth.Contract(myContractLive, this.contractAddressLive);

    //             contract.getPastEvents('UserPoolIncome', {
    //                 filter: { user: address }, // Using an array means OR: e.g. 20 or 23
    //                 fromBlock: 0
    //             }, (error, event) => {
    //                 if (error) {
    //                     return reject(error);
    //                 }
    //                 // console.log(event, 'pool income');
    //                 resolve(event);
    //             });
    //         } catch (error) { reject(error) }
    //     });
    // }
    public async UserPoolIncome(address: string) {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT * FROM poolIncome WHERE user='${address}'`;
            try {
                const records: any = await this.callQuerys(query);
                if (records.length > 0) {
                    resolve(records);
                } else {
                    resolve([]);
                }
            } catch (error) {
                resolve(error);
            }
        });
    }
    public async totalParticipants() {
        return new Promise(async (resolve, reject) => {
            try {
                this.myContractOb.methods
                    .lastUserId()
                    .call()
                    .then(
                        (res: any) => {
                            let d = 0;
                            if (parseInt(res) > 0) {
                                // d = parseInt(res) + 200;
                                d = parseInt(res) + 0;
                            }
                            resolve(d.toString());
                        }
                    )
                    .catch(reject);

            } catch (error) { reject(error); }
        });
    }
    public async eventLog() {
        return new Promise(async (resolve, reject) => {
            try {
                this.myContractOb.getPastEvents(
                    "allEvents",
                    {
                        filter: {
                            // user: address,
                            // matrix: matrix,
                            // level: level
                        },
                        fromBlock: 0
                    },
                    async (error: any, event: any) => {
                        console.log("logsXXXXXDDD :", event);
                        if (event.length > 0) {
                            const r = await event.map((d: any) => {
                                const returnValues: any = d.returnValues;
                                returnValues.transactionHash = d.transactionHash;
                                returnValues.event = d.event;
                                returnValues.address = d.address;
                                return returnValues;
                            });
                            resolve(r);
                        } else {
                            resolve([]);
                        }
                    }
                );

            } catch (error) { reject(error); }
        });
    }
}

export default new Account();