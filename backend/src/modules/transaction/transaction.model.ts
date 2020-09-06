// import * as SqlString from "sqlstring";
import Web3 from 'web3';
import BaseModel from '../../model/base.model';

import { API_MSG } from "../../constant/response";
import TransactionHelper from "./Transaction.helper";

const myContract = require('../../bin/myContractABI.json');

class Transaction extends BaseModel {
    public INFURA_API = process.env.INFURA_API!;
    public BLOCK_NUMBER = process.env.BLOCK_NUMBER!;
    public web3: Web3;
    public myContractOb: any;
    //public INFURA_API_LIVE = 'https://3.21.162.137:8546';
    public contractAddress = process.env.CONTRACT_ADDRESS;
    public DEFAULT_ADDRESS = process.env.DEFAULT_ADDRESS!;

    constructor() {
        super();
        this.web3 = new Web3(this.INFURA_API);
        // this.web3 = new Web3('http://52.52.96.207:8545');
        this.myContractOb = new this.web3.eth.Contract(myContract, this.contractAddress);
    }

    /**
     * get all transactions
     * @param userAddress
     */
    public async getAll(userAddress: string, urlQuery: any) {

        return new Promise(async (resolve, reject) => {
            let query = `SELECT * FROM transactions WHERE userAddress='${userAddress}'`;
            if (urlQuery.level) {
                query += ` AND level='${urlQuery.level}'`;
            }
            if (urlQuery.matrix) {
                query += ` AND matrix='${urlQuery.matrix}'`;
            }

            query += ` ORDER BY id DESC`;
            try {
                const records: any = await this.callQuerys(query);
                if (records.length > 0) {
                    resolve({ status: true, data: records });
                } else {
                    resolve({ status: false, message: 'No record found' });
                }
            } catch (error) {
                resolve(error);
            }
        });
    }
    /**
     * Insert Transaction
     * @param data
     */
    public async add(data: any) {
        return new Promise(async (resolve, reject) => {
            const userId = data.userId || '';
            const upline = data.upline || '';
            const level = data.level || '';
            const matrix = data.matrix || '';
            const query = `INSERT INTO transactions SET
                userAddress='${data.userAddress}',
                upline='${upline}',
                userId='${userId}',
                level='${level}',
                matrix='${matrix}',
                transactionHash='${data.transactionHash}',
                response='${JSON.stringify(data.response)}',
                message='${data.message}',
                loginType='${data.loginType}',
                amount='${data.amount}',
                transactionType='${data.transactionType}';`;

            try {
                // console.log('request query', query);
                const result: any = await this.callQuery(query);
                if (result) {
                    resolve({ status: true, id: result.insertId });
                } else {
                    resolve({ status: false, message: API_MSG.SQL_QUERY_ERROR });
                }
            } catch (error) {
                resolve({ status: false, message: error.sqlMessage });
            }
        });
    }

    /**
     * Update Payment Inital Request
     * @param userRequest
     */
    public async totalRegistrationPerDay() {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT * FROM transactions WHERE created_at >= curdate() AND matrix='1' AND transactionType !='Buy Plan' AND message='success';`;

            try {
                let records: any = await this.callQuerys(query);
                if (records.length > 0) {
                    records = records.length;
                    // records += 180;
                    resolve(records);
                } else {
                    resolve(0);
                }
            } catch (error) {
                resolve(error);
            }
        });
    }
    /**
     * get all transactions total
     * @param 
     */
    public async getTotal() {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT sum(amount) as total FROM transactions WHERE message='success'`;
            try {
                const query2 = `SELECT eur  FROM currencyData WHERE currency='ether'`;
                const records2: any = await this.callQuerys(query2);

                const eur: any = records2[0].eur;

                const records: any = await this.callQuerys(query);
                if (records.length > 0) {
                    // records[0].total += 200;
                    resolve({ ether: (records[0].total).toFixed(2), eur: parseInt((eur * records[0].total).toString()) });
                } else {
                    resolve({ ether: 0, eur: 0 });
                }
            } catch (error) {
                resolve(error);
            }
        });
    }

    public async getTotalLogs() {
        return new Promise(async (resolve, reject) => {
            try {
                const web3 = new Web3(this.INFURA_API);
                // const web3 = new Web3('http://52.52.96.207:8545');
                const contract = new web3.eth.Contract(myContract, this.contractAddress);

                contract.getPastEvents(
                    "IncomeTransferred",
                    {
                        filter: {
                        },
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error, event: any) => {
                        if (error) {
                            console.log(error);
                            return reject(error);
                        }
                        // console.log("logsXXXXXDDD :", event);
                        if (event.length > 0) {
                            const query2 = `SELECT eur  FROM currencyData WHERE currency='ether'`;
                            const records2: any = await this.callQuerys(query2);
                            const eur: any = records2[0].eur;

                            const results = event.map((d: any) => d.returnValues);
                            let r = results.reduce((sum: number, d: any) => {
                                let ethValue = web3.utils.fromWei(d.value, 'ether');
                                // console.log({ ethValue, v: d.value });
                                return sum + parseFloat(ethValue);
                            }, 0);
                            if (r > 0) {
                                // r += 200;
                                resolve({ ether: (r).toFixed(2), eur: parseInt((eur * r).toString()) });
                            } else {
                                resolve({ ether: 0, eur: 0 });
                            }
                        } else {
                            resolve({ ether: 0, eur: 0 });
                        }
                    });
            } catch (error) { reject(error); }
        });
    }

    public async userIncomeLog(user: string = '') {
        return new Promise(async (resolve, reject) => {
            let filter = {};
            if (user) {
                filter = { user };
            }

            try {
                this.myContractOb.getPastEvents(
                    "IncomeTransferred",
                    {
                        filter,
                        fromBlock: 7090497
                    },
                    async (error: any, event: any) => {
                        if (error) {
                            return reject(error);
                        }
                        console.log("IncomeReceived :", event.length);
                        if (event.length > 0) {
                            let ResultArr = event.map((e: any) => {
                                let user = e.returnValues.user;
                                let from = e.returnValues.from;
                                let objLevel = e.returnValues.level;
                                let objMatrix = e.returnValues.matrix;
                                let value = e.returnValues.value;
                                return { user, from, level: objLevel, matrix: objMatrix, value };
                            });
                            let results = await Promise.all(ResultArr);
                            // console.log(results, r, 'results');
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    });
            } catch (error) { reject(error); }
        });
    }

    public async missedRewardsReceived(receiver: string = '') {
        return new Promise(async (resolve, reject) => {
            let filter = {};
            if (receiver) {
                filter = { receiver };
            }

            try {

                this.myContractOb.getPastEvents(
                    "MissedRewardsReceived",
                    {
                        filter,
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error: any, event: any) => {
                        if (error) {
                            return reject(error);
                        }
                        console.log("MissedRewardsReceived :", event.length);

                        if (event.length > 0) {
                            let ResultArr = event.map((e: any) => e.returnValues);
                            let results = await Promise.all(ResultArr);
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    });
            } catch (error) { reject(error); }
        });
    }
    public async rewardsSent(from: string = '') {
        return new Promise(async (resolve, reject) => {
            let filter = {};
            if (from) {
                filter = { from };
            }

            try {

                this.myContractOb.getPastEvents(
                    "RewardsSent",
                    {
                        filter,
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error: any, event: any) => {
                        if (error) {
                            return reject(error);
                        }
                        console.log("RewardsSent :", event.length);

                        if (event.length > 0) {
                            let ResultArr = event.map((e: any) => e.returnValues);
                            let results = await Promise.all(ResultArr);
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    });
            } catch (error) { reject(error); }
        });
    }
    public async reinvestLog(user: string = '') {
        return new Promise(async (resolve, reject) => {
            let filter = {};
            if (user) {
                filter = { user };
            }

            try {

                this.myContractOb.getPastEvents(
                    "Recycle",
                    {
                        filter,
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error: any, event: any) => {
                        if (error) {
                            return reject(error);
                        }
                        console.log("Recycle :", event.length);

                        if (event.length > 0) {
                            let ResultArr = event.map((e: any) => {
                                let user = e.returnValues.user;
                                let caller = e.returnValues.caller;
                                let currentReferrer = e.returnValues.currentReferrer;
                                let objLevel = e.returnValues.level;
                                let objMatrix = e.returnValues.matrix;
                                return { user, caller, currentReferrer, level: objLevel, matrix: objMatrix };
                            });
                            let results = await Promise.all(ResultArr);
                            // const r = results.filter(d => d.level === level && d.matrix === matrix);
                            // console.log(results, r, 'results');
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    });
            } catch (error) { reject(error); }
        });
    }
    public async newReferralLog(referrer: string = '', reinvest = '') {
        return new Promise(async (resolve, reject) => {
            let filter = {};
            if (referrer) {
                filter = { referrer };
            }

            try {
                this.myContractOb.getPastEvents(
                    "NewReferral",
                    {
                        filter,
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error: any, event: any) => {
                        if (error) {
                            return reject(error);
                        }
                        console.log("NewReferral :", event.length);

                        if (event.length > 0) {
                            let ResultArr = event.map(async (e: any) => {
                                const returnValues = e.returnValues;
                                const block = await this.web3.eth.getBlock(e.blockNumber);
                                returnValues.timestamp = block.timestamp;
                                return returnValues;
                            });
                            let results = await Promise.all(ResultArr);
                            // const r = results.filter(d => d.level === level && d.matrix === matrix);
                            // console.log(results, r, 'results');
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    });
            } catch (error) { reject(error); }
        });
    }
    /**
     * update currency data
     * @param 
     */
    public async updateEUR() {
        return new Promise(async (resolve, reject) => {
            try {
                const result: any = await TransactionHelper.getEUR();
                const value = parseInt(result.price);
                const query = `UPDATE currencyData SET eur='${value}' WHERE currency='ether'`;
                // console.log(result, value);
                const records: any = await this.callQuery(query);
                if (records.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(error);
            }
        });
    }
    /**
     * get EUR currency data
     * @param 
     */
    public async getEUR() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT eur FROM currencyData WHERE currency='ether'`;
                const records: any = await this.callQuerys(query);
                if (records.length > 0) {
                    const eur: any = records[0].eur;
                    resolve(eur);
                } else {
                    resolve(0);
                }
            } catch (error) {
                resolve(error);
            }
        });
    }

    private async convertFromWei(value: string) {
        return new Promise(async (resolve, reject) => {
            try {
                // const web3 = new Web3(this.INFURA_API);
                // const web3 = new Web3('http://52.52.96.207:8545');
                const result = this.web3.utils.fromWei(value, "ether");
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    };
    //
    private async usersZ3Matrix(userAddress: string, level: string) {
        return new Promise(async (resolve, reject) => {

            try {
                this.myContractOb.methods
                    .usersZ3Matrix(userAddress, level)
                    .call()
                    .then((result: any) => {
                        resolve(result);
                    })
                    .catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    };

    private async usersZ3MatrixArr(userAddress: string, levelArr: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const a = levelArr.map(async (d: any) => {
                    return await this.usersZ3Matrix(userAddress, d.level);
                });
                Promise.all(a).then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    };

    // usersZ4Matrix price Manish
    private async usersZ4Matrix(userAddress: string, level: string) {
        return new Promise(async (resolve, reject) => {
            try {
                this.myContractOb.methods
                    .usersZ4Matrix(userAddress, level)
                    .call()
                    .then((result: any) => {
                        resolve(result);
                    })
                    .catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    };

    private async usersZ4MatrixArr(userAddress: string, levelArr: any) {
        return new Promise(async (resolve, reject) => {
            console.log(userAddress);
            try {
                const a = levelArr.map(async (d: any) => {
                    return await this.usersZ4Matrix(userAddress, d.level);
                });
                Promise.all(a).then(resolve).catch(reject);

            } catch (error) {
                reject(error);
            }
        });
    };

    //get users details
    public async getUsers(address: string) {
        return new Promise(async (resolve, reject) => {
            try {

                this.myContractOb.methods
                    .users(address)
                    .call()
                    .then((result: any) => {
                        resolve(result);
                    })
                    .catch(reject);
            } catch (error) { reject(error); }
        });
    }
    //get level price 
    public async levelPrice(level: string) {
        return new Promise(async (resolve, reject) => {
            try {

                this.myContractOb.methods
                    .levelPrice(level)
                    .call()
                    .then(async (result: any) => {
                        const r = await this.convertFromWei(result);
                        resolve(r);
                    })
                    .catch(reject);
            } catch (error) { reject(error); }
        });
    }
    private async sortDataAsc(arr: any, property: string) {
        return arr.sort((a: any, b: any) => { return a[property] - b[property]; });
    }
    // M3 Blocks
    private async getZ3IndexBlock(array: any) {
        let results2 = await this.sortDataAsc(array, 'timestamp');
        let array2: any = [];

        let items = 3;

        let getPreviousBlock: number = array.length / items;
        getPreviousBlock = parseInt(getPreviousBlock.toString());

        let z3BlockIndex = (getPreviousBlock * 3);
        let add2Toz3WithReinvestBlock = z3BlockIndex + 2;

        for (let i = z3BlockIndex; i <= add2Toz3WithReinvestBlock; i++) {
            const element = results2[i];
            if (element !== undefined) {
                array2 = [...array2, element];
            }
        }
        return array2;
    }

    // get m4 block index array
    private async getM4IndexBlockArr(array: any) {

        let results2: any = await this.sortDataAsc(array, 'timestamp');
        let array2: any = [];

        let userLevelOneArr = [];
        let userLevelTwoArr = [];

        let items = 6;

        let getPreviousBlock: number = array.length / items;
        getPreviousBlock = parseInt(getPreviousBlock.toString());

        let M4BlockIndex = (getPreviousBlock * 6);
        let add2ToM4BlockIndex = M4BlockIndex + 5;

        for (let i = M4BlockIndex; i <= add2ToM4BlockIndex; i++) {
            const element = results2[i];
            if (element !== undefined) {
                array2 = [...array2, element];
            }
        }

        let sortedArry: any = await this.sortDataAsc(array2, 'place');
        for (const z4 of sortedArry) {
            if (z4.place === "1" || z4.place === "2") {
                userLevelOneArr.push(z4);
            } else {
                userLevelTwoArr.push(z4);
            }
        }
        return {
            levelOne: userLevelOneArr,
            levelTwo: userLevelTwoArr
        };
    };
    //get levelOneUsers(3x)
    public async levelOneUsers(newUserPlacelog: any, levelArr: any, currentId: string) {
        return new Promise(async (resolve, reject) => {
            try {

                const a = levelArr.map(async (d: any, index: number) => {
                    const level = (index + 1).toString();
                    const filterNewUserPlaceLog = await this.filterReinvest(newUserPlacelog, level, "1");
                    if (filterNewUserPlaceLog.length > 0) {
                        const lastArray = await this.getZ3IndexBlock(filterNewUserPlaceLog);
                        const ab = lastArray.map(async (a: any, index: number) => {
                            return await this.getUsers(a.user).then(async (data: any) => {

                                const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                                const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;

                                let ahead = false;
                                let aheadResults: any = await this.usersZ3Matrix(data.referrer, level);
                                aheadResults = aheadResults[3];
                                if (!aheadResults) {
                                    ahead = true;
                                }

                                return {
                                    address: a.user,
                                    id: data.id,
                                    referer: data.referrer,
                                    partnersCount: data.partnersCount,
                                    up,
                                    down,
                                    ahead,
                                };
                            });
                        });
                        return await Promise.all(ab);
                    } else {
                        return [];
                    }
                });
                Promise.all(a).then(resolve).catch(reject);
            } catch (error) { reject(error); }
        });
    }
    //get levelOneUsers(4x)
    public async getLevelTwoArr(newReferrelLogsArr: any, levelArr: any, currentId: string, address: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const a = levelArr.map(async (d: any, index: number) => {
                    let levelTwoArr = [{}, {}, {}, {}];
                    let levelOneUsers: any = [];
                    let levelTwoUsers: any = [];
                    const level = (index + 1).toString();
                    const filterNewUserPlaceLog = await this.filterReinvest(newReferrelLogsArr, level, "2");
                    const getM4BlockArray = await this.getM4IndexBlockArr(filterNewUserPlaceLog);

                    if (getM4BlockArray.levelOne.length > 0) {
                        const ab = getM4BlockArray.levelOne.map(async (a: any, index: number) => {
                            return await this.getUsers(a.user).then(async (data: any) => {
                                const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                                const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;

                                let ahead = false;
                                let aheadResults: any = await this.usersZ4Matrix(data.referrer, level);
                                aheadResults = aheadResults[4];
                                if (!aheadResults) {
                                    ahead = true;
                                }
                                return {
                                    address: a.user,
                                    id: data.id,
                                    referrer: data.referrer,
                                    partnersCount: data.partnersCount,
                                    up,
                                    down,
                                    ahead,
                                };
                            });
                        });
                        levelOneUsers = await Promise.all(ab);

                        if (getM4BlockArray.levelTwo.length > 0) {
                            const ab = getM4BlockArray.levelTwo.map(async (a: any, index: number) => {
                                return await this.getUsers(a.user).then(async (data: any) => {
                                    let upOverflow = (parseInt(currentId) > parseInt(data.id) && (data.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                                    let bottomOverflow = (parseInt(currentId) < parseInt(data.id) && (data.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                                    // let position = levelOneUsers[1] !== undefined && levelOneUsers[1].address.toLowerCase() === data.referrer.toLowerCase() ? index + 3 : index;
                                    let ahead = false;
                                    let aheadResults: any = await this.usersZ4Matrix(data.referrer, level);
                                    aheadResults = aheadResults[4];

                                    // //referral position
                                    const position = a.place;
                                    if (!aheadResults) {
                                        ahead = true;
                                    }
                                    if (ahead) {
                                        upOverflow = false;
                                        bottomOverflow = false;
                                    }

                                    return {
                                        address: a.user,
                                        id: data.id,
                                        referrer: data.referrer,
                                        partnersCount: data.partnersCount,
                                        upOverflow,
                                        bottomOverflow,
                                        position,
                                        ahead,
                                    };
                                });
                            });
                            levelTwoUsers = await Promise.all(ab);

                            for (let i = 0; i < 4; i++) {
                                if (levelTwoUsers[i]) {
                                    if (levelTwoUsers[i].position === "3") {
                                        levelTwoArr[0] = levelTwoUsers[i];
                                    }
                                    if (levelTwoUsers[i].position === "4") {
                                        levelTwoArr[1] = levelTwoUsers[i];
                                    }
                                    if (levelTwoUsers[i].position === "5") {
                                        levelTwoArr[2] = levelTwoUsers[i];
                                    }
                                    if (levelTwoUsers[i].position === "6") {
                                        levelTwoArr[3] = levelTwoUsers[i];
                                    }
                                }
                            }
                        }
                    }

                    return {
                        levelOneUsers,
                        levelTwoUsers,
                        levelTwoArr,
                    };
                });
                Promise.all(a).then(resolve).catch(reject);
            } catch (error) { reject(error); }
        });
    }
    private async filterReinvest(arr: any, level: string, matrix: string) {
        return arr.filter((d: any) => d.level === level && d.matrix === matrix);
    }
    //get user levelOneUsers page data
    public async getUserLevelOneUsers(getIndexArr: any, currentId: string, level: string) {
        const ab = getIndexArr.map(async (a: any, index: number) => {
            return await this.getUsers(a.user).then(async (data: any) => {
                // let show = true;
                // if (index === 1 && userMatrix[1][0] === userMatrix[1][1]) {
                //     show = false;
                // }
                const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;
                let ahead = false;
                let aheadResults: any = await this.usersZ3Matrix(data.referrer, level);
                aheadResults = aheadResults[3];
                if (!aheadResults) {
                    ahead = true;
                }
                const innerUserMatrix: any = await this.usersZ3Matrix(a.user, level);
                let innerUserCounts = 0;
                if (innerUserMatrix && innerUserMatrix[1].length > 0) {
                    innerUserCounts = innerUserMatrix[1].length;
                }
                const reinvestlog1 = await this.reinvestLog(a.user);
                const innerReinvestStatus = await this.filterReinvest(reinvestlog1, level, "1");
                // adding cycle income in 3x
                if (innerReinvestStatus && innerReinvestStatus.length > 0) {
                    innerUserCounts += 3 * innerReinvestStatus.length;
                }

                return {
                    address: a,
                    id: data.id,
                    referrer: data.referrer,
                    partnersCount: data.partnersCount,
                    up,
                    down,
                    ahead,
                    innerUserCounts,
                    // show
                };
            });
        });
        return await Promise.all(ab);
    }
    //get user levelOneUsers page data
    public async getUserLevel4xUsers(getIndexArr: any, currentId: string, level: string, address: string) {
        let levelTwoArr = [{}, {}, {}, {}];
        let levelOneUsers: any = [];
        let levelTwoUsers: any = [];
        return new Promise(async (resolve, reject) => {
            const ab = getIndexArr.levelOne.map(async (a: any, index: number) => {
                return await this.getUsers(a.user).then(async (data: any) => {
                    const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                    const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;
                    // let show = true;
                    // if (index === 1 && userMatrix[1][0] === userMatrix[1][1]) {
                    //     show = false;
                    // }
                    let ahead = false;
                    let aheadResults: any = await this.usersZ4Matrix(data.referrer, level);
                    aheadResults = aheadResults[4];
                    if (!aheadResults) {
                        ahead = true;
                    }
                    const innerUserMatrix: any = await this.usersZ4Matrix(a.user, level);
                    let innerUserCounts = 0;
                    if (innerUserMatrix) {
                        innerUserCounts = innerUserMatrix[1].length + innerUserMatrix[2].length;
                    }

                    const reinvestlog2 = await this.reinvestLog(a.user);
                    const innerReinvestStatus = await this.filterReinvest(reinvestlog2, level, "2");
                    //adding cycle income in 3x
                    if (innerReinvestStatus && innerReinvestStatus.length > 0) {
                        innerUserCounts += 6 * innerReinvestStatus.length;
                    }

                    return {
                        address: a,
                        id: data.id,
                        referrer: data.referrer,
                        partnersCount: data.partnersCount,
                        up,
                        down,
                        ahead,
                        innerUserCounts
                    };
                });
            });

            levelOneUsers = await Promise.all(ab);

            if (getIndexArr.levelTwo.length > 0) {
                const ab = getIndexArr.levelTwo.map(async (a: any, index: number) => {
                    return await this.getUsers(a.user).then(async (data: any) => {
                        let upOverflow = (parseInt(currentId) > parseInt(data.id) && (data.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                        let bottomOverflow = (parseInt(currentId) < parseInt(data.id) && (data.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                        // const position = levelOneUsers[1] !== undefined && levelOneUsers[1].address.toLowerCase() === data.referrer.toLowerCase() ? index + 3 : index;

                        let ahead = false;
                        let aheadResults: any = await this.usersZ4Matrix(data.referrer, level);
                        aheadResults = aheadResults[4];
                        if (!aheadResults) {
                            ahead = true;
                        }
                        if (ahead) {
                            upOverflow = false;
                            bottomOverflow = false;
                        }
                        const innerUserMatrix: any = await this.usersZ4Matrix(a.user, level);
                        let innerUserCounts = 0;
                        if (innerUserMatrix) {
                            innerUserCounts = innerUserMatrix[1].length + innerUserMatrix[2].length;
                        }
                        //referral position
                        const position = a.place;

                        const reinvestlog3 = await this.reinvestLog(a.user);
                        const innerReinvestStatus = await this.filterReinvest(reinvestlog3, level, "2");
                        //adding cycle income in 4x
                        if (innerReinvestStatus.length > 0) {
                            innerUserCounts += 6 * innerReinvestStatus.length;
                        }
                        return {
                            address: a.user,
                            id: data.id,
                            referrer: data.referrer,
                            partnersCount: data.partnersCount,
                            upOverflow,
                            bottomOverflow,
                            position,
                            ahead,
                            innerUserCounts
                        };
                    });
                });

                levelTwoUsers = await Promise.all(ab);

                for (let i = 0; i < 4; i++) {
                    if (levelTwoUsers[i]) {
                        if (levelTwoUsers[i].position === "3") {
                            levelTwoArr[0] = levelTwoUsers[i];
                        }
                        if (levelTwoUsers[i].position === "4") {
                            levelTwoArr[1] = levelTwoUsers[i];
                        }
                        if (levelTwoUsers[i].position === "5") {
                            levelTwoArr[2] = levelTwoUsers[i];
                        }
                        if (levelTwoUsers[i].position === "6") {
                            levelTwoArr[3] = levelTwoUsers[i];
                        }

                    }
                }
            }

            resolve({
                levelOneUsers,
                levelTwoUsers,
                levelTwoArr
            });
        });
    }

    private async sortData(arr: any, property: string) {
        return arr.sort((a: any, b: any) => { return b[property] - a[property]; });
    };
    //get user levelOneUsers page data
    public async getUserTransactionNew(address: string, level: string, matrix: string) {
        return new Promise(async (resolve, reject) => {
            try {
                this.myContractOb.getPastEvents(
                    "NewReferral",
                    {
                        filter: {
                            referrer: address
                        },
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error: any, event: any) => {
                        if (error) {
                            // alert('userincome log error' + error.message);
                            return reject(error);
                        }

                        if (event.length > 0) {
                            const currentId = await this.getUsers(address).then((d: any) => d.id);
                            let reopenCount = 0;
                            let ResultArr = [];
                            if (level !== '' && matrix !== '') {
                                ResultArr = event.filter((e: any) => e.returnValues.level === level && e.returnValues.matrix === matrix);
                            } else {
                                ResultArr = event;
                            }
                            ResultArr = ResultArr.map(async (e: any) => {
                                const returnValues = e.returnValues;
                                returnValues.transactionHash = e.transactionHash;
                                returnValues.blockNumber = e.blockNumber;

                                const block = await this.web3.eth.getBlock(e.blockNumber);
                                returnValues.timestamp = block.timestamp;

                                returnValues.amount = await this.levelPrice(returnValues.level);
                                const user: any = await this.getUsers(returnValues.user);
                                returnValues.userId = user.id;

                                let upOverflow = (returnValues.matrix === "2" && parseInt(currentId) > parseInt(user.id) && (user.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                                let bottomOverflow = (returnValues.matrix === "2" && parseInt(currentId) < parseInt(user.id) && (user.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;

                                let ahead = false;

                                if (returnValues.matrix === "1") { //3x
                                    let aheadResults: any = await this.usersZ3Matrix(user.referrer, returnValues.level);
                                    aheadResults = aheadResults[3];
                                    if (!aheadResults) {
                                        ahead = true;
                                    }
                                }

                                if (returnValues.matrix === "2") { //4x
                                    let aheadResults: any = await this.usersZ4Matrix(user.referrer, returnValues.level);
                                    aheadResults = aheadResults[4];
                                    if (!aheadResults) {
                                        ahead = true;
                                    }
                                }

                                if (ahead) {
                                    upOverflow = false;
                                    bottomOverflow = false;
                                }
                                returnValues.upOverflow = upOverflow;
                                returnValues.bottomOverflow = bottomOverflow;
                                returnValues.ahead = ahead;

                                // returnValues.up = (parseInt(currentId) < parseInt(returnValues.userId)) ? true : false;
                                // returnValues.down = (parseInt(currentId) > parseInt(returnValues.userId)) ? true : false;
                                // returnValues.reopenCount = reopenCount;
                                if (returnValues.place === "3" && returnValues.matrix === "1") {
                                    reopenCount++;
                                }
                                if (returnValues.place === "6" && returnValues.matrix === "2") {
                                    reopenCount++;
                                }
                                return returnValues;
                            });
                            const results = await Promise.all(ResultArr);

                            let results2 = await this.sortData(results, 'timestamp');
                            // console.log(results2, 'after sort');
                            //to end with zero in the last 
                            reopenCount--;
                            results2 = results2.map(async (e: any) => {
                                const a = e;
                                a.reopenCount = reopenCount;
                                if (a.place === "3" && matrix === "1") {
                                    reopenCount--;
                                }
                                if (a.place === "6" && matrix === "2") {
                                    reopenCount--;
                                }
                                return a;
                            });
                            results2 = await Promise.all(ResultArr);
                            // console.log(results2, 'results');
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    }
                );

            } catch (error) {
                reject(error);
            }
        });
    }

    private addNewTransaction(data: any, address: string) {

        const timeConverter = (UNIX_timestamp: any) => {
            const a = new Date(UNIX_timestamp * 1000);
            const year = a.getFullYear();
            const month = a.getMonth();
            const date = a.getDate();
            const hour = a.getHours();
            const min = a.getMinutes();
            const sec = a.getSeconds();
            const time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
            return time;
        };

        return new Promise(async (resolve, reject) => {
            let query = '';
            const block: any = await this.web3.eth.getBlock(data.blockNumber);
            const time = timeConverter(block.timestamp);
            console.log(data.blockNumber, block.timestamp, time, 'in loop');

            try {
                if (data.event === 'Registration') {
                    query = `INSERT INTO transactions SET
                    created_at='${time}',
                    userAddress='${address}',
                    upline='${data.referrer}',
                    userId='${data.referrerId}',
                    level='1',
                    matrix='1',
                    transactionHash='${data.transactionHash}',
                    response='',
                    message='success',
                    loginType='auto',
                    amount='0.025',
                    transactionType='Auto Registration';`;
                    const result: any = await this.callQuery(query);

                    query = `INSERT INTO transactions SET
                    created_at='${time}',
                    userAddress='${address}',
                    upline='${data.referrer}',
                    userId='${data.referrerId}',
                    level='1',
                    matrix='2',
                    transactionHash='${data.transactionHash}',
                    response='',
                    message='success',
                    loginType='auto',
                    amount='0.025',
                    transactionType='Auto Registration';`;
                    const result2: any = await this.callQuery(query);
                    resolve(true);
                }
                if (data.event === 'Upgrade') {
                    const amount = await this.levelPrice(data.level);
                    const userId = await this.getUsers(data.referrer).then((data: any) => data.id);

                    query = `INSERT INTO transactions SET
                    created_at='${time}',
                    userAddress='${address}',
                    upline='${data.referrer}',
                    userId='${userId}',
                    level='${data.referrer}',
                    matrix='${data.referrer}',
                    transactionHash='${data.transactionHash}',
                    response='',
                    message='success',
                    loginType='auto',
                    amount='${amount}',
                    transactionType='Buy Plan';`;
                    const result2: any = await this.callQuery(query);
                    resolve(true);
                }
            } catch (error) {
                resolve({ status: false, message: error.sqlMessage });
            }


        });
    };

    //get missing transaction of the user
    public async addMissingTransaction(address: string) {
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
                        fromBlock: this.BLOCK_NUMBER
                    },
                    async (error: any, event: any) => {
                        // console.log("logsXXXXXDDD :", event.length);
                        if (event.length > 0) {
                            //get events from contract
                            let userEvents = event.filter((d: any) => d.event === 'Registration' || d.event === 'Upgrade')
                                .map(async (d: any) => {
                                    const returnValues: any = d.returnValues;
                                    returnValues.transactionHash = d.transactionHash;
                                    returnValues.blockNumber = d.blockNumber;
                                    returnValues.event = d.event;
                                    returnValues.address = d.address;

                                    return returnValues;
                                });
                            userEvents = await Promise.all(userEvents);

                            userEvents = userEvents.filter((d: any) => d.user && d.user.toLowerCase() === address.toLowerCase());

                            if (userEvents.length > 0) {
                                // //getting transaction from the database;
                                let query = `SELECT * FROM transactions WHERE transactionHash != '';`;

                                let records: any = await this.callQuerys(query);
                                const transactionHashArr = records.map((d: any) => d.transactionHash.toLowerCase());
                                // console.log(transactionHashArr, 'db');
                                userEvents.map(async (d: any) => {
                                    if (transactionHashArr.indexOf(d.transactionHash.toLowerCase()) === -1) {
                                        const rr = await this.addNewTransaction(d, address);
                                        console.log('+++inserted+++');
                                    }
                                });

                                return resolve({ status: true, data: [] });
                            }
                            resolve({ status: true });
                        } else {
                            resolve({ status: false, data: [] });
                        }
                    }
                );

            } catch (error) { reject(error); }
        });
    }
    /**
  * get data using socket with web 3
  * @param 
  */
    public async getApiAndEmit(socket: any) {
        // Emitting a new message. Will be consumed by the client
        socket.on("reinvestLog", async (m: any) => {
            // console.log("reinvest log [server](message): %s", JSON.stringify(m));
            const res = await this.reinvestLog(m.address);
            socket.emit("reinvestLogRes", res);
        });
        socket.on("userIncomeLog", async (m: any) => {
            // console.log("user income log [server](message): %s", JSON.stringify(m));
            const res = await this.userIncomeLog(m.address);
            socket.emit("userIncomeLogRes", res);
        });
        socket.on("levelPrice", async (m: any) => {
            // console.log("level: %s", JSON.stringify(m));
            const res = await this.levelPrice(m.level);
            socket.emit("levelPriceRes", res);
        });
        socket.on("usersZ3Matrix", async (m: any) => {
            // console.log("usersZ3Matrix: %s", JSON.stringify(m));
            let res = await this.usersZ3Matrix(m.address, m.level);
            // console.log('response 1', res);
            socket.emit("usersZ3MatrixRes", res);
        });
        socket.on("usersZ3MatrixSocketArr", async (m: any) => {
            // console.log("usersZ3Matrix: %s", JSON.stringify(m));
            let res = await this.usersZ3MatrixArr(m.address, m.levelArr);
            // console.log('response 2', res);
            socket.emit("usersZ3MatrixSocketArrRes", res);
        });
        socket.on("usersZ4Matrix", async (m: any) => {
            // console.log("level: %s", JSON.stringify(m));
            let res = await this.usersZ4Matrix(m.address, m.level);
            socket.emit("usersZ4MatrixRes", res);
        });
        socket.on("usersZ4MatrixSocketArr", async (m: any) => {
            let res = await this.usersZ4MatrixArr(m.address, m.levelArr);
            // console.log('response 2', res);
            socket.emit("usersZ4MatrixSocketArrRes", res);
        });
        socket.on("users", async (m: any) => {
            // console.log("level: %s", JSON.stringify(m));
            let res = await this.getUsers(m.address);
            socket.emit("usersRes", res);
        });
        socket.on("levelOneUsers", async (m: any) => {
            // console.log("level: %s", JSON.stringify(m));
            let res = await this.levelOneUsers(m.arr, m.levelArr, m.currentId);
            // console.log('levelOneUsers', res);
            socket.emit("levelOneUsersRes", res);

        });
        socket.on("levelTwoArr", async (m: any) => {
            // console.log("levelTwoArr: %s", JSON.stringify(m));
            let res = await this.getLevelTwoArr(m.arr, m.levelArr, m.currentId, m.address);
            // console.log('levelTwoUsersArrRes', res);
            socket.emit("levelTwoArrRes", res);
        });
        socket.on("userLevel3xOneUsers", async (m: any) => {
            // console.log("userLevel3xOneUsers: %s", JSON.stringify(m));
            let res = await this.getUserLevelOneUsers(m.arr, m.currentId, m.level);
            // console.log('levelOneUsers', res);
            socket.emit("userLevel3xOneUsersRes", res);
        });
        socket.on("userLevel4xOneUsers", async (m: any) => {
            // console.log("userLevel4xOneUsers: %s", JSON.stringify(m));
            let res = await this.getUserLevel4xUsers(m.arr, m.currentId, m.level, m.address);
            // console.log('levelOneUsers', res);
            socket.emit("userLevel4xOneUsersRes", res);
        });
        socket.on("getUserTransactionNew", async (m: any) => {
            // console.log("getUserTransactionNew: %s", JSON.stringify(m));
            let res = await this.getUserTransactionNew(m.address, m.level, m.matrix);
            // console.log('getUserTransactionNew', res);
            socket.emit("getUserTransactionNewRes", res);
        });
        socket.on("missedRewardsReceived", async (m: any) => {
            // console.log("getUserTransactionNew: %s", JSON.stringify(m));
            let res = await this.missedRewardsReceived(m.address);
            // console.log('getUserTransactionNew', res);
            socket.emit("missedRewardsReceivedRes", res);
        });
        socket.on("rewardsSent", async (m: any) => {
            // console.log("getUserTransactionNew: %s", JSON.stringify(m));
            let res = await this.rewardsSent(m.address);
            // console.log('getUserTransactionNew', res);
            socket.emit("rewardsSentRes", res);
        });
        socket.on("newReferral", async (m: any) => {
            // console.log("newReferralRes: %s", JSON.stringify(m));
            let res = await this.newReferralLog(m.address);
            // console.log('newReferralRes', res);
            socket.emit("newReferralRes", res);
        });
    }
}

export default new Transaction();