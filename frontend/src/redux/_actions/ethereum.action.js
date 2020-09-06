import { startLoading, stopLoading } from "./loading.action";
import { toast } from "../../components/Toast/Toast";
import {
  saveUserDetail,
  saveLogin,
  saveEuroPrice,
  saveRegistrationPerDay,
  saveTotals,
  saveTotalParticipants,
  // saveUserIncomeLog,
  // saveReinvetLog
} from "./persist.action";

// import { setCookie, getCookie } from "../../_utils/index";
import { DEFAULT_ADDRESS } from "../../_constants";
import { EthereumService } from "../../Services/EthereumService";
import { arraySplice } from "redux-form";

/** seting action types */
export const actionTypes = {
  SAVE_WALLET_CONNECTOR: "SAVE_WALLET_CONNECTOR",
  SAVE_WALLET_DISCONNECTOR: "SAVE_WALLET_DISCONNECTOR",
  SAVE_LEVEL_3X: "SAVE_LEVEL_3X",
  SAVE_LEVEL_4X: "SAVE_LEVEL_4X",
  SAVE_USER_LEVEL_3X: "SAVE_USER_LEVEL_3X",
  SAVE_USER_LEVEL_4X: "SAVE_USER_LEVEL_4X",
  SAVE_LEVEL_TOTAL_INCOME: "SAVE_LEVEL_TOTAL_INCOME",
  SAVE_NEW_USER_PLACE_LOG: "SAVE_NEW_USER_PLACE_LOG"
};

/*
 * Action creators for login
 */
export function saveWalletConnector(data) {
  return {
    type: actionTypes.SAVE_WALLET_CONNECTOR,
    data
  };
}

export function clearWalletConnector() {
  return {
    type: actionTypes.SAVE_WALLET_DISCONNECTOR
  };
}

export function saveLevel3x(data) {
  return {
    type: actionTypes.SAVE_LEVEL_3X,
    data
  };
}

export function saveLevel4x(data) {
  return {
    type: actionTypes.SAVE_LEVEL_4X,
    data
  };
}

export function saveUserLevel3x(data) {
  return {
    type: actionTypes.SAVE_USER_LEVEL_3X,
    data
  };
}
export function saveUserLevel4x(data) {
  return {
    type: actionTypes.SAVE_USER_LEVEL_4X,
    data
  };
}

export function saveTotalIncome(data) {
  return {
    type: actionTypes.SAVE_LEVEL_TOTAL_INCOME,
    data
  };
}

export function saveNewUserPlaceLog(data) {
  return {
    type: actionTypes.SAVE_NEW_USER_PLACE_LOG,
    data
  }
}

//action functions with dispatch
//get getEuroPrice
export function getEuroPrice() {
  return async (dispatch, getState) => {
    const {
      persist: { address }
    } = getState();
    return await EthereumService.getEuroPrice()
      .then(res => {
        const { data: { eur } } = res;
        dispatch(saveEuroPrice(eur));
      })
      .catch(error => {
        if (error) {
          toast.error(error.message);
        }
      });
  };
}
//get transaction of user
export function getTransaction() {
  return async (dispatch, getState) => {
    dispatch(startLoading());
    const {
      persist: { address }
    } = getState();
    try {
      const res = await EthereumService.getTransaction(address);
      dispatch(stopLoading());
      return res.data;
    }
    catch (error) {
      dispatch(stopLoading());
      if (error) {
        toast.error(error.message);
      }
      return { status: false };
    }
  };
}

//add transaction of user
export function addTransaction(data) {
  return (dispatch) => {
    return EthereumService.addTransaction(data);
    // return true;
  };
}
//Convert Wei to ether
export function convertFromWei(value, unit) {
  return async (dispatch) => {
    try {
      const result = await EthereumService.convertFromWei(value, unit);
      return result;
    }
    catch (error) {
      return toast.error(error.message);
    }
  };
}

//get user using metamask
export function getUserMetaMask(address, loginType = 'metamask') {
  return async (dispatch, getState) => {
    // let state = getState();
    // dispatch(startLoading());
    try {
      const res = await EthereumService.getUsers(address);
      // dispatch(stopLoading());
      // console.log(res, "user data");
      if (res.id !== "0") {
        dispatch(saveLogin({ address, loginType }));
        dispatch(saveUserDetail(res));
      }
      return res;
    }
    catch (error) {
      if (error) {
        // console.log(error.message);
        toast.error(error.message);
      }
    }
  };
}
//get user more details from contract
export function getUsers(address) {
  return async (dispatch, getState) => {
    let state = getState();
    // dispatch(startLoading());
    try {
      const res = await EthereumService.getUsers(address);
      return res;
    }
    catch (error) {
      if (error) {
        toast.error(error.message);
      }
    }
  };
}
//get user details and dispatch totalIncome and incomeAfterTopUp
export function getDetails() {
  return (dispatch, getState) => {
    const {
      persist: { address }
    } = getState();
    // dispatch(startLoading());
    return EthereumService.getUsers(address)
      .then(res => {
        // dispatch(stopLoading());
      })
      .catch(error => {
        if (error) {
          console.log(error.message);
          toast.error(error.message);
        }
        // dispatch(stopLoading());
      });
  };
}

//register user with contract using metamask
export function regUserMetaMask(address, upline, value) {
  return async (dispatch, getState) => {
    // let { persist: { totalParticipants } } = getState();
    dispatch(startLoading());
    return EthereumService.regUserExternal(address, upline, value)
      .then(async res => {
        dispatch(stopLoading());
        toast.success(
          "Register successfully. Transaction Hash:" + res.transactionHash
        );
        //addding transaction in the backend
        const userId = await EthereumService.getUsers(upline).then(data => data.id);
        const data_2 = {
          userAddress: address,
          upline,
          userId,
          level: "1",
          matrix: "1",
          loginType: "metamask",
          transactionHash: res.transactionHash,
          response: res,
          message: "success",
          transactionType: "metamask Registration",
          amount: "0.025"
        };
        dispatch(addTransaction(data_2));
        const data_3 = {
          userAddress: address,
          upline,
          userId,
          level: "1",
          matrix: "2",
          loginType: "metamask",
          transactionHash: res.transactionHash,
          response: res,
          message: "success",
          transactionType: "metamask Registration",
          amount: "0.025"
        };
        dispatch(addTransaction(data_3));
        return await dispatch(getUserMetaMask(address));
      })
      .catch(async error => {
        if (error) {
          console.log(error);
          toast.error(error.message);
        }
        //addding transaction in the backend
        const userId = await EthereumService.getUsers(upline).then(data => data.id);
        const data = {
          userAddress: address,
          upline,
          userId,
          loginType: "metamask",
          transactionHash: "",
          response: error,
          message: error.message,
          transactionType: "MetaMask Registration",
          amount: '0'
        };
        dispatch(addTransaction(data));
        dispatch(stopLoading());
        return false;
      });
  };
}

// level price meghraj
export function levelPrice() {
  return async (dispatch, getState) => {

    const filterReinvest = (arr, level, matrix) => {
      return arr.filter(d => d.level === level && d.matrix === matrix);
    }

    const userIncomeSum = async (arr, level, matrix) => {
      let r = arr.reduce((sum, d) => {
        if (d.level === level && d.matrix === matrix) {
          return sum + parseFloat(d.value);
        } else {
          return sum + 0;
        }
      }, 0);
      if (r > 0) {
        r = r.toString();
        r = await EthereumService.convertFromWei(r);
        r = parseFloat(r);
        return r;
      } else {
        return 0;
      }
    }

    const filterLevelArr = (arr, level) => {
      return arr.filter((d, index) => parseInt(level) === (index + 1));
    }

    const sortDataAsc = (arr, property) => {
      return arr.sort((a, b) => { return a[property] - b[property] });
    }

    // M3 Blocks
    const getZ3IndexBlock = (array, reinvestLogsArrayLength) => {
      let results2 = sortDataAsc(array, 'timestamp');
      let array2 = [];

      // 
      let reinvestLogsArrayLenght = array.length;
      let items = 3;

      // let calcBlock = ((parseInt(reinvestLogsArrayLenght)) % items);
      let getPreviousBlock = parseInt(((parseInt(reinvestLogsArrayLenght)) / items));

      if (reinvestLogsArrayLength === 0) {
        getPreviousBlock = 0;
      }

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
    const getM4IndexBlockArr = (array, reinvestLogsArrayLength) => {

      let results2 = sortDataAsc(array, 'timestamp');
      let array2 = [];

      let userLevelOneArr = [];
      let userLevelTwoArr = [];

      let reinvestLogsArrayLenght = results2.length;
      let items = 6;

      // let calcBlock = ((parseInt(reinvestLogsArrayLenght) + 1) % items);
      let getPreviousBlock = parseInt(((parseInt(reinvestLogsArrayLenght)) / items));

      if (reinvestLogsArrayLength === 0) {
        getPreviousBlock = 0;
      }

      let M4BlockIndex = (getPreviousBlock * 6);
      let add2ToM4BlockIndex = M4BlockIndex + 5;

      for (let i = M4BlockIndex; i <= add2ToM4BlockIndex; i++) {
        const element = results2[i];
        if (element !== undefined) {
          array2 = [...array2, element];
        }
      }

      let sortedArry = sortDataAsc(array2, 'place');

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
    }

    const {
      persist: { loginType, address },
      ethereum: { levelArr }
    } = getState();
    dispatch(startLoading());
    let totalIncome = 0, totalIncome3x = 0, totalIncome4x = 0;
    let reinvestlog = [];
    let userIncomeLog = [];
    let newReferralLogsArr = [];

    try {
      if (loginType === 'metamask') {//without socket frontend
        let currentId = await EthereumService.getUsers(address).then(data => data.id);
        reinvestlog = await EthereumService.reinvest(address);
        // console.log(reinvestlog, 'before loop reinvestment log');
        userIncomeLog = await EthereumService.userIncome(address);
        newReferralLogsArr = await EthereumService.newReferral(address);
        // console.log(newReferralLogsArr, 'metamask');

        let r = levelArr.map(async d => {//x3 matrix
          let levelOneUsers = [], userCounts = 0;
          let getFilteredZ3RefferelArr = [];
          let levelPrice = d.cost;
          let reinvestStatus = await filterReinvest(reinvestlog, d.level, "1");
          let userMatrix = await EthereumService.usersZ3Matrix(address, d.level);

          getFilteredZ3RefferelArr = await filterReinvest(newReferralLogsArr, d.level, "1");
          let getIndex3xArr = await getZ3IndexBlock(getFilteredZ3RefferelArr, reinvestStatus.length);

          // console.log('User')
          let activeStatus = userMatrix[3];
          // let userIncome = await userIncomeSum(userIncomeLog, d.level, "1");
          let userIncome = (levelPrice * userMatrix[1].length);

          //adding cycle income in 3x
          if (reinvestStatus.length > 0) {
            if (address.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {
              userIncome += (3 * levelPrice) * reinvestStatus.length;
            } else {
              userIncome += (2 * levelPrice) * reinvestStatus.length;
            }
            userCounts += 3 * reinvestStatus.length;
          }
          totalIncome += userIncome;
          totalIncome3x += userIncome;
          if (getIndex3xArr.length > 0) {
            userCounts += userMatrix[1].length;
            const ab = getIndex3xArr.map(async (a, index) => {
              return await EthereumService.getUsers(a.user).then(async data => {
                const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;

                let ahead = false;
                let aheadResults = await EthereumService.usersZ3Matrix(data.referrer, d.level);
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
                }
              });
            });
            levelOneUsers = await Promise.all(ab);
          }

          dispatch(saveTotalIncome({ totalIncome, totalIncome3x, totalIncome4x }));
          return {
            levelPrice,
            activeStatus,
            reinvestStatus,
            userMatrix,
            userIncome,
            levelOneUsers,
            userCounts
          };
        });
        Promise.all(r).then(d => {
          // console.log("3xd data", d);
          dispatch(saveLevel3x(d));
        })

        //4x matrix
        r = levelArr.map(async d => {
          let partnersCount = 0, userCounts = 0;
          let levelOneUsers = [];
          let levelTwoUsers = [];
          let getFilteredZ4RefferelArr = [];
          let levelTwoArr = [{}, {}, {}, {}];
          let levelPrice = d.cost;
          let reinvestStatus = await filterReinvest(reinvestlog, d.level, "2");
          getFilteredZ4RefferelArr = await filterReinvest(newReferralLogsArr, d.level, "2");
          // console.log(reinvestStatus, reinvestStatus.length);
          let getInde4xArr = await getM4IndexBlockArr(getFilteredZ4RefferelArr, (reinvestStatus.length));

          // console.log('4X Array' , 'Level One', getInde4xArr.levelOne, 'Level TWo', getInde4xArr.levelTwo);

          let userMatrix = await EthereumService.usersZ4Matrix(address, d.level);
          let activeStatus = userMatrix[4];
          let userIncome = await userIncomeSum(userIncomeLog, d.level, "2");
          // console.log(userIncome, 'LOGS INCOME')
          // let userIncome = 0;
          userCounts = userMatrix[1].length + userMatrix[2].length;
          // if (address.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {//add for default address
          //   userIncome = (levelPrice * userMatrix[1].length);
          // }
          // userIncome = userIncome + (levelPrice * userMatrix[2].length);
          //adding cycle income in 4x
          if (reinvestStatus.length > 0) {
            userCounts += 6 * reinvestStatus.length;
          }

          totalIncome += userIncome;
          totalIncome4x += userIncome;

          if (getInde4xArr.levelOne.length > 0) {
            const ab = getInde4xArr.levelOne.map(async (a, index) => {
              return await EthereumService.getUsers(a.user).then(async data => {
                const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;

                let ahead = false;
                let aheadResults = await EthereumService.usersZ4Matrix(data.referrer, d.level);
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
                }
              });
            });
            levelOneUsers = await Promise.all(ab);
          }

          if (getInde4xArr.levelTwo.length > 0) {
            const ab = getInde4xArr.levelTwo.map(async (a, index) => {
              return await EthereumService.getUsers(a.user).then(async data => {
                // const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
                // const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;
                let upOverflow = (parseInt(currentId) > parseInt(data.id) && (data.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                let bottomOverflow = (parseInt(currentId) < parseInt(data.id) && (data.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                // let position = levelOneUsers[1] !== undefined && levelOneUsers[1].address.toLowerCase() === data.referrer.toLowerCase() ? index + 3 : index;
                let ahead = false;
                let aheadResults = await EthereumService.usersZ4Matrix(data.referrer, d.level);
                aheadResults = aheadResults[4];
                if (!aheadResults) {
                  ahead = true;
                }

                if (ahead) {
                  upOverflow = false;
                  bottomOverflow = false;
                }
                // const innerUserMatrix = await EthereumService.usersZ4Matrix(a.user, d.level);
                //referral position
                const position = a.place;

                return {
                  address: a.user,
                  id: data.id,
                  referrer: data.referrer,
                  partnersCount: data.partnersCount,
                  upOverflow,
                  bottomOverflow,
                  position,
                  ahead,
                }
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

          dispatch(saveTotalIncome({ totalIncome, totalIncome3x, totalIncome4x }));
          return {
            levelPrice,
            activeStatus,
            reinvestStatus,
            userMatrix,
            userIncome,
            levelOneUsers,
            levelTwoUsers,
            levelTwoArr,
            userCounts
          };
        });
        Promise.all(r).then(d => {
          // console.log("4xd data", d);
          dispatch(saveLevel4x(d));
          dispatch(stopLoading());
        }).catch(err => {
          console.log(err);
          dispatch(stopLoading());
        });
      }

      if (loginType === 'trustwallet') {//with socket backend
        // let getFilteredZ3Arr = [];
        let currentId = await EthereumService.getUsersSocket(address).then(data => data.id);
        reinvestlog = await EthereumService.reinvestLogSocket(address);
        userIncomeLog = await EthereumService.userIncomeLogSocket(address);

        newReferralLogsArr = await EthereumService.newReferralSocket(address);
        // console.log(newReferralLogsArr, 'level price function');
        const userMatrixArr = await EthereumService.usersZ3MatrixSocketArr(address, levelArr);
        const levelOneUsersArr = await EthereumService.levelOneUsers(newReferralLogsArr, levelArr, currentId);

        const userMatrixArr4x = await EthereumService.usersZ4MatrixSocketArr(address, levelArr);
        const levelTwoArrArr = await EthereumService.levelTwoArr(newReferralLogsArr, levelArr, currentId, address);

        let r = levelArr.map(async d => {//x3
          let levelOneUsers = [], userCounts = 0;
          let levelPrice = d.cost;
          const reinvestStatus = filterReinvest(reinvestlog, d.level, "1");

          let userMatrix = filterLevelArr(userMatrixArr, d.level);
          if (userMatrix[0]) {
            userMatrix = userMatrix[0];
          } else {
            userMatrix = {};
          }

          let activeStatus = userMatrix[3];
          // let userIncome = await userIncomeSum(userIncomeLog, d.level, "1");
          let userIncome = (levelPrice * userMatrix[1].length);
          //adding cycle income in 3x
          if (reinvestStatus.length > 0) {
            if (address.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {
              userIncome += (3 * levelPrice) * reinvestStatus.length;
            } else {
              userIncome += (2 * levelPrice) * reinvestStatus.length;
            }
            userCounts += 3 * reinvestStatus.length;
          }
          totalIncome += userIncome;
          totalIncome3x += userIncome;
          if (userMatrix[1].length > 0) {
            userCounts += userMatrix[1].length;

            levelOneUsers = filterLevelArr(levelOneUsersArr, d.level);
            if (levelOneUsers.length > 0) {
              levelOneUsers = levelOneUsers[0];
            }
          }

          return {
            levelPrice,
            activeStatus,
            reinvestStatus,
            userMatrix,
            userIncome,
            levelOneUsers,
            userCounts
          };
        });
        Promise.all(r).then(d => {
          // console.log("3xd data", d);
          dispatch(saveLevel3x(d));

          dispatch(saveTotalIncome({ totalIncome, totalIncome3x, totalIncome4x }));
        }).catch(err => {
          console.log(err);
          dispatch(stopLoading());
        });

        //4x matrix
        r = levelArr.map(async d => {
          let userCounts = 0;
          let getFilteredZ4Arr = [];
          let levelOneUsers = [];
          let levelTwoUsers = [];
          let levelTwoArr = [{}, {}, {}, {}];
          let levelPrice = d.cost;
          const reinvestStatus = await filterReinvest(reinvestlog, d.level, "2");
          let userMatrix = filterLevelArr(userMatrixArr4x, d.level);

          if (userMatrix[0]) {
            userMatrix = userMatrix[0];
          } else {
            userMatrix = {};
          }
          let activeStatus = userMatrix[4];
          let userIncome = await userIncomeSum(userIncomeLog, d.level, "2");
          // let userIncome = 0;
          userCounts = userMatrix[1].length + userMatrix[2].length;
          //adding cycle income in 4x
          if (reinvestStatus.length > 0) {
            userCounts += 6 * reinvestStatus.length;
          }
          totalIncome += userIncome;
          totalIncome4x += userIncome;
          if (userMatrix[1].length > 0) {
            const r = filterLevelArr(levelTwoArrArr, d.level);
            levelOneUsers = r[0].levelOneUsers;
            if (userMatrix[2].length > 0) {
              levelTwoUsers = r[0].levelTwoUsers;
              levelTwoArr = r[0].levelTwoArr;
            }
          }

          return {
            levelPrice,
            activeStatus,
            reinvestStatus,
            userMatrix,
            userIncome,
            levelOneUsers,
            levelTwoUsers,
            levelTwoArr,
            userCounts
          };
        });
        Promise.all(r).then(d => {
          // console.log("4xd data", d);
          dispatch(saveLevel4x(d));
          dispatch(saveTotalIncome({ totalIncome, totalIncome3x, totalIncome4x }));
          dispatch(stopLoading());
        }).catch(err => {
          console.log(err);
          dispatch(stopLoading());
        });
      }
    } catch (error) {
      console.log(error, 'actions');
      dispatch(stopLoading());
    }
  };
}
// level price meghraj7T  1X=B 9
export function userLevelPrice(userAddress, level, matrix, reinvest) {
  return async (dispatch, getState) => {

    const filterReinvest = (arr, level, matrix) => {
      return arr.filter(d => d.level === level && d.matrix === matrix);
    }
    const userIncomeSum = async (arr, level, matrix) => {
      let r = arr.reduce((sum, d) => {
        if (d.level === level && d.matrix === matrix) {
          return sum + parseFloat(d.value);
        } else {
          return sum + 0;
        }
      }, 0);
      if (r > 0) {
        r = r.toString();
        r = await EthereumService.convertFromWei(r);
        r = parseFloat(r);
        return r;
      } else {
        return 0;
      }
    }

    const sortDataAsc = (arr, property) => {
      return arr.sort((a, b) => { return a[property] - b[property] });
    }

    // M3 Blocks
    const getZ3IndexBlock = (array, reinvestLogsArrayLength) => {
      let results2 = sortDataAsc(array, 'timestamp');
      let array2 = [];

      if (reinvest !== undefined) {
        let z3WithReinvestBlock = (reinvest * 3);
        let add2Toz3WithReinvestBlock = z3WithReinvestBlock + 2;

        for (let i = z3WithReinvestBlock; i <= add2Toz3WithReinvestBlock; i++) {
          const element = results2[i];
          if (element !== undefined) {
            array2 = [...array2, element];
          }
        }
      } else {
        let reinvestLogsArrayLenght = array.length;
        let items = 3;

        // let calcBlock = ((parseInt(reinvestLogsArrayLenght)) % items);
        let getPreviousBlock = parseInt(((parseInt(reinvestLogsArrayLenght)) / items));

        if (reinvestLogsArrayLength === 0) {
          getPreviousBlock = 0;
        }
        let z3BlockIndex = (getPreviousBlock * 3);
        let add2Toz3WithReinvestBlock = z3BlockIndex + 2;

        for (let i = z3BlockIndex; i <= add2Toz3WithReinvestBlock; i++) {
          const element = results2[i];
          if (element !== undefined) {
            array2 = [...array2, element];
          }
        }
      }
      return array2;
    }

    // get m4 block index array
    const getM4IndexBlockArr = (array, reinvestLogsArrayLength) => {
      let results2 = sortDataAsc(array, 'timestamp');
      let array2 = [];

      let userLevelOneArr = [];
      let userLevelTwoArr = [];

      if (reinvest !== undefined) {
        let M4WithReinvestBlock = (reinvest * 6);
        let add2ToM4WithReinvestBlock = M4WithReinvestBlock + 5;

        for (let i = M4WithReinvestBlock; i <= add2ToM4WithReinvestBlock; i++) {
          const element = results2[i];
          if (element !== undefined) {
            array2 = [...array2, element];
          }
        }

      } else {
        let reinvestLogsArrayLenght = results2.length;
        let items = 6;

        // let calcBlock = ((parseInt(reinvestLogsArrayLenght) + 1) % items);
        let getPreviousBlock = parseInt(((parseInt(reinvestLogsArrayLenght)) / items));

        if (reinvestLogsArrayLength === 0) {
          getPreviousBlock = 0;
        }

        let M4BlockIndex = (getPreviousBlock * 6);
        let add2ToM4BlockIndex = M4BlockIndex + 5;

        for (let i = M4BlockIndex; i <= add2ToM4BlockIndex; i++) {
          const element = results2[i];
          if (element !== undefined) {
            array2 = [...array2, element];
          }
        }
      }

      let sortedArry = sortDataAsc(array2, 'place');

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
    }

    const {
      persist: { loginType }
    } = getState();

    dispatch(startLoading());
    let reinvestlog = [], userIncomeLog = [], missedRewardReceivedLog = [], rewardSentLog = [], newReferralLog = [];
    let activeStatus, userMatrix, missedRewardReceivedIncome = 0, rewardSentIncome = 0;
    if (loginType === 'metamask') {
      reinvestlog = await EthereumService.reinvest(userAddress);
      userIncomeLog = await EthereumService.userIncome(userAddress);
      missedRewardReceivedLog = await EthereumService.missedRewardsReceived(userAddress);
      rewardSentLog = await EthereumService.rewardsSent(userAddress);

      newReferralLog = await EthereumService.newReferral(userAddress);
      newReferralLog = filterReinvest(newReferralLog, level, matrix);

      const levelPrice = await EthereumService.levelPrice(level);
      const reinvestStatus = await filterReinvest(reinvestlog, level, matrix);
      //gift and lost logs
      if (missedRewardReceivedLog.length > 0) {
        missedRewardReceivedIncome = missedRewardReceivedLog.reduce((sum, d) => {
          if (d.level === level && d.matrix === matrix) {
            return sum + parseFloat(levelPrice);
          } else {
            return sum + 0;
          }
        }, 0);
      }
      if (rewardSentLog.length > 0) {
        rewardSentIncome = rewardSentLog.reduce((sum, d) => {
          if (d.level === level && d.matrix === matrix) {
            return sum + parseFloat(levelPrice);
          } else {
            return sum + 0;
          }
        }, 0);
      }

      let currentId = await EthereumService.getUsers(userAddress).then(data => data.id);

      if (matrix === "1") {//3x matrix
        let levelOneUsers = [], userCounts = 0;
        let referrerId = "";
        const getIndexArr = getZ3IndexBlock(newReferralLog, reinvestStatus.length);
        userMatrix = await EthereumService.usersZ3Matrix(userAddress, level);

        activeStatus = userMatrix[3];
        // let userIncome = await userIncomeSum(userIncomeLog, level, matrix);
        let userIncome = (levelPrice * userMatrix[1].length);
        userCounts = newReferralLog.length;
        //adding cycle income in 3x

        if (reinvestStatus.length > 0) {
          //default address
          if (userAddress.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {
            userIncome += (3 * levelPrice) * reinvestStatus.length;
          } else {
            userIncome += (2 * levelPrice) * reinvestStatus.length;
          }
          // userCounts += 3 * reinvestStatus.length;
        }
        if (userMatrix[0] !== "0x0000000000000000000000000000000000000000") {
          referrerId = await EthereumService.getUsers(userMatrix[0]).then(data => data.id);
        }
        //replace userMatrix[1]
        if (getIndexArr.length > 0) {
          // userCounts += userMatrix[1].length;
          const ab = getIndexArr.map(async (a, index) => {
            return await EthereumService.getUsers(a.user).then(async data => {
              const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
              const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;
              let ahead = false;
              let aheadResults = await EthereumService.usersZ3Matrix(data.referrer, level);
              aheadResults = aheadResults[3];
              if (!aheadResults) {
                ahead = true;
              }
              const innerUserMatrix = await EthereumService.usersZ3Matrix(a.user, level);
              let innerUserCounts = innerUserMatrix[1].length;
              const reinvestlog1 = await EthereumService.reinvest(a.user);
              const innerReinvestStatus = await filterReinvest(reinvestlog1, level, matrix);
              //adding cycle income in 3x
              if (innerReinvestStatus.length > 0) {
                innerUserCounts += 3 * innerReinvestStatus.length;
              }

              return {
                address: a.user,
                id: data.id,
                referrer: data.referrer,
                partnersCount: data.partnersCount,
                up,
                down,
                ahead,
                innerUserCounts,
              }
            });
          });

          levelOneUsers = await Promise.all(ab);
        }

        dispatch(saveUserLevel3x({
          currentId,
          referrerId,
          levelPrice,
          activeStatus,
          reinvestStatus,
          userMatrix,
          userIncome,
          levelOneUsers,
          userCounts,
          missedRewardReceivedIncome,
          rewardSentIncome
        }));

        dispatch(stopLoading());
      }

      if (matrix === "2") {//4x matrix
        let levelOneUsers = [];
        let levelTwoUsers = [];
        let levelTwoArr = [{}, {}, {}, {}];
        const getIndexArr = getM4IndexBlockArr(newReferralLog, reinvestStatus.length);
        // console.log('MATRIX OBJECT 2', getIndexArr);
        let referrerId = "", userCounts = 0;
        userMatrix = await EthereumService.usersZ4Matrix(userAddress, level);
        activeStatus = userMatrix[4];
        if (userMatrix[0] !== "0x0000000000000000000000000000000000000000") {
          referrerId = await EthereumService.getUsers(userMatrix[0]).then(data => data.id);
        }
        let userIncome = await userIncomeSum(userIncomeLog, level, matrix);
        // let userIncome = 0;
        // if (userAddress.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {//add for default address
        //   userIncome = (levelPrice * userMatrix[1].length);
        // }
        userCounts += userMatrix[1].length;

        // userIncome += (levelPrice * userMatrix[2].length);
        userCounts += userMatrix[2].length;
        //adding cycle income in 4x
        if (reinvestStatus.length > 0) {
          // userIncome += (3 * levelPrice) * reinvestStatus.length;
          userCounts += 6 * reinvestStatus.length;
        }

        // level on matrix
        if (getIndexArr.levelOne.length > 0) {
          const ab = getIndexArr.levelOne.map(async (a, index) => {
            return await EthereumService.getUsers(a.user).then(async data => {
              const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
              const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;
              let show = true;
              if (index === 1 && userMatrix[1][0] === userMatrix[1][1]) {
                show = false;
              }

              let ahead = false;
              let aheadResults = await EthereumService.usersZ4Matrix(data.referrer, level);
              aheadResults = aheadResults[4];
              if (!aheadResults) {
                ahead = true;
              }
              const innerUserMatrix = await EthereumService.usersZ4Matrix(a.user, level);
              let innerUserCounts = innerUserMatrix[1].length + innerUserMatrix[2].length;
              const reinvestlog2 = await EthereumService.reinvest(a.user);
              const innerReinvestStatus = await filterReinvest(reinvestlog2, level, matrix);
              //adding cycle income in 3x
              if (innerReinvestStatus.length > 0) {
                innerUserCounts += 6 * innerReinvestStatus.length;
              }

              return {
                address: a.user,
                id: data.id,
                referrer: data.referrer,
                partnersCount: data.partnersCount,
                up,
                down,
                ahead,
                innerUserCounts,
                show
              }
            });
          });
          levelOneUsers = await Promise.all(ab);

        }

        // level two matrix 
        if (getIndexArr.levelTwo.length > 0) {
          const ab = getIndexArr.levelTwo.map(async (a, index) => {
            return await EthereumService.getUsers(a.user).then(async data => {
              // const up = (parseInt(currentId) < parseInt(data.id)) ? true : false;
              // const down = (parseInt(currentId) > parseInt(data.id)) ? true : false;
              let upOverflow = (parseInt(currentId) > parseInt(data.id) && (data.referrer.toLowerCase() !== userAddress.toLowerCase())) ? true : false;
              let bottomOverflow = (parseInt(currentId) < parseInt(data.id) && (data.referrer.toLowerCase() !== userAddress.toLowerCase())) ? true : false;
              // const position = levelOneUsers[1] !== undefined && levelOneUsers[1].address.toLowerCase() === data.referrer.toLowerCase() ? index + 3 : index;

              let ahead = false;
              let aheadResults = await EthereumService.usersZ4Matrix(data.referrer, level);
              activeStatus = aheadResults[4];
              if (!aheadResults) {
                ahead = true;
              }
              if (ahead) {
                upOverflow = false;
                bottomOverflow = false;
              }
              const innerUserMatrix = await EthereumService.usersZ4Matrix(a.user, level);
              //referral position
              const position = a.place;
              let innerUserCounts = innerUserMatrix[1].length + innerUserMatrix[2].length;
              const reinvestlog3 = await EthereumService.reinvest(a.user);
              ;
              const innerReinvestStatus = await filterReinvest(reinvestlog3, level, matrix);
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
              }
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

        dispatch(saveUserLevel4x({
          currentId,
          referrerId,
          levelPrice,
          activeStatus,
          reinvestStatus,
          userMatrix,
          userIncome,
          levelOneUsers,
          levelTwoUsers,
          levelTwoArr,
          userCounts,
          missedRewardReceivedIncome,
          rewardSentIncome
        }));
        dispatch(stopLoading());
      }

    }

    if (loginType === 'trustwallet') {
      //listen socket:
      reinvestlog = await EthereumService.reinvestLogSocket(userAddress);
      userIncomeLog = await EthereumService.userIncomeLogSocket(userAddress);
      missedRewardReceivedLog = await EthereumService.missedRewardsReceivedSocket(userAddress);
      rewardSentLog = await EthereumService.rewardsSentSocket(userAddress);

      newReferralLog = await EthereumService.newReferralSocket(userAddress);
      newReferralLog = filterReinvest(newReferralLog, level, matrix);

      // console.log(newReferralLog,'trustwallet');
      // alert(JSON.stringify(userIncomeLog));
      const levelPrice = await EthereumService.levelPriceSocket(level);

      const reinvestStatus = await filterReinvest(reinvestlog, level, matrix);

      //gift and lost logs
      if (missedRewardReceivedLog.length > 0) {
        missedRewardReceivedIncome = missedRewardReceivedLog.reduce((sum, d) => {
          if (d.level === level && d.matrix === matrix) {
            return sum + parseFloat(levelPrice);
          } else {
            return sum + 0;
          }
        }, 0);
      }

      if (rewardSentLog.length > 0) {
        rewardSentIncome = rewardSentLog.reduce((sum, d) => {
          if (d.level === level && d.matrix === matrix) {
            return sum + parseFloat(levelPrice);
          } else {
            return sum + 0;
          }
        }, 0);
      }


      let currentId = await EthereumService.getUsersSocket(userAddress).then(data => data.id);

      if (matrix === "1") {//3x matrix
        let levelOneUsers = [], userCounts = 0;
        let referrerId = "";
        const getIndexArr = getZ3IndexBlock(newReferralLog, reinvestStatus.length);
        console.log('TRUST WALLET REFEREL LOGS', getIndexArr);

        userMatrix = await EthereumService.usersZ3MatrixSocket(userAddress, level);
        activeStatus = userMatrix[3];
        // let userIncome = await userIncomeSum(userIncomeLog, level, matrix);
        let userIncome = (levelPrice * userMatrix[1].length);

        //adding cycle income in 3x
        if (reinvestStatus.length > 0) {
          //default address
          if (userAddress.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {
            userIncome += (3 * levelPrice) * reinvestStatus.length;
          } else {
            userIncome += (2 * levelPrice) * reinvestStatus.length;
          }
          userCounts += 3 * reinvestStatus.length;
        }

        if (userMatrix[0] !== "0x0000000000000000000000000000000000000000") {
          referrerId = await EthereumService.getUsersSocket(userMatrix[0]).then(data => data.id);
        }

        console.log('USER MATRIX', userMatrix);
        if (getIndexArr.length > 0) {
          userCounts += getIndexArr.length;
          levelOneUsers = await EthereumService.userLevel3xOneUsers(getIndexArr, currentId, level);
        }

        dispatch(saveUserLevel3x({
          currentId,
          referrerId,
          levelPrice,
          activeStatus,
          reinvestStatus,
          userMatrix,
          userIncome,
          levelOneUsers,
          userCounts,
          missedRewardReceivedIncome,
          rewardSentIncome
        }));
        dispatch(stopLoading());
      }

      if (matrix === "2") {//4x matrix
        let levelOneUsers = [];
        let levelTwoUsers = [];
        let levelTwoArr = [{}, {}, {}, {}];
        const getIndexArr = getM4IndexBlockArr(newReferralLog, reinvestStatus.length);

        let referrerId = "", userCounts = 0;
        userMatrix = await EthereumService.usersZ4MatrixSocket(userAddress, level);
        activeStatus = userMatrix[4];
        if (userMatrix[0] !== "0x0000000000000000000000000000000000000000") {
          referrerId = await EthereumService.getUsersSocket(userMatrix[0]).then(data => data.id);
        }

        let userIncome = await userIncomeSum(userIncomeLog, level, matrix);

        userCounts += userMatrix[1].length;
        userCounts += userMatrix[2].length;
        //adding cycle income in 4x
        if (reinvestStatus.length > 0) {
          // userIncome += (3 * levelPrice) * reinvestStatus.length;
          userCounts += 6 * reinvestStatus.length;
        }

        if (Object.keys(getIndexArr).length > 0) {
          const r = await EthereumService.userLevel4xOneUsers(getIndexArr, currentId, level, userAddress);
          if (r) {
            levelOneUsers = r.levelOneUsers;
            levelTwoUsers = r.levelTwoUsers;
            levelTwoArr = r.levelTwoArr;
          }
        }

        dispatch(saveUserLevel4x({
          currentId,
          referrerId,
          levelPrice,
          activeStatus,
          reinvestStatus,
          userMatrix,
          userIncome,
          levelOneUsers,
          levelTwoUsers,
          levelTwoArr,
          userCounts,
          missedRewardReceivedIncome,
          rewardSentIncome
        }));
        dispatch(stopLoading());
      }

    }
  };
}

//join user to pool after login Meghraj
export function purchaseLevel(value, level, matrix) {
  return async (dispatch, getState) => {
    const {
      persist: { loginType, address, totalParticipants, userDetails }
    } = getState();
    dispatch(startLoading());
    //convert to string
    level = level.toString();

    try {
      const res = await EthereumService.purchaseLevel(address, value, matrix, level);
      dispatch(stopLoading());
      toast.success(
        "Buy Plan successfully. Transaction Hash:" + res.transactionHash
      );
      //addding transaction in the backend
      // console.log(res, 'buy plan transaction');
      let referrer = '';
      if (Array.isArray(res.events.NewReferral)) {
        referrer = res.events.NewReferral[0].returnValues.referrer;
      }
      else {
        referrer = res.events.NewReferral.returnValues.referrer;
      }

      const userId = await EthereumService.getUsers(referrer).then(data => data.id);

      const data_1 = {
        userAddress: address,
        upline: referrer,
        userId,
        level,
        matrix,
        loginType,
        transactionHash: res.transactionHash,
        response: res,
        message: "success",
        transactionType: "Buy Plan",
        amount: value
      };
      dispatch(addTransaction(data_1));
    }
    catch (error) {
      dispatch(stopLoading());
      if (error) {
        toast.error(error.message);
        // if (error.code !== 4001) {
        //   //addding transaction in the backend
        //   const data_3 = {
        //     userAddress: address,
        //     loginType,
        //     transactionHash: "",
        //     response: error,
        //     message: error.message,
        //     transactionType: "Buy Plan",
        //     amount: planPrice
        //   };
        //   dispatch(addTransaction(data_3));
        // }
      }

    }
  };
}

//get user from trust wallet from contract
export function getUserTrustWallet(address) {
  return (dispatch, getState) => {
    // dispatch(startLoading());
    return EthereumService.getUsers(address)
      .then(res => {
        // dispatch(stopLoading());
        if (res.id !== "0") {
          dispatch(saveLogin({ address, loginType: "trustwallet" }));
          dispatch(saveUserDetail(res));
        }
        return res;
      })
      .catch(error => {
        if (error) {
          // console.log(error.message);
          toast.error(error.message);
        }
        // dispatch(stopLoading());
      });
  };
}
//register user with contract using metamask
export function regUserTrustWallet(address, upline, value) {
  return async (dispatch, getState) => {
    let { persist } = getState();
    dispatch(startLoading());

    try {
      const res = await EthereumService.regUserExternal(address, upline, value);
      dispatch(stopLoading());
      // console.log(res, 'response');
      toast.success(
        "Register successfully. Transaction Hash:" + res.transactionHash
      );
      const userId = await EthereumService.getUsers(upline).then(data => data.id);
      //addding transaction in the backend
      const data_2 = {
        userAddress: address,
        upline,
        userId,
        level: "1",
        matrix: "1",
        loginType: "trustwallet",
        transactionHash: res.transactionHash,
        response: res,
        message: "success",
        transactionType: "TrustWallet Registration",
        amount: "0.025"
      };
      dispatch(addTransaction(data_2));
      const data_3 = {
        userAddress: address,
        upline,
        userId,
        level: "1",
        matrix: "2",
        loginType: "trustwallet",
        transactionHash: res.transactionHash,
        response: res,
        message: "success",
        transactionType: "TrustWallet Registration",
        amount: "0.025"
      };
      dispatch(addTransaction(data_3));
      return await dispatch(getUserTrustWallet(address));
    }
    catch (error) {
      if (error) {
        toast.error(error.message);
      }
      //addding transaction in the backend
      const userId = await EthereumService.getUsers(upline).then(data_3 => data_3.id);
      const data_4 = {
        userAddress: address,
        upline,
        userId,
        loginType: "trustwallet",
        transactionHash: "",
        response: error,
        message: error.message,
        transactionType: "Trustwallet Registration",
        amount: '0'
      };
      dispatch(addTransaction(data_4));
      dispatch(stopLoading());
      return false;
    }
  };
}

//logout function for trust wallet
export function EthereumLogOut() {
  return (dispatch, getState) => {
    const {
      ethereum: { walletConnector }
    } = getState();
    if (walletConnector.connected) {
      walletConnector.killSession({ message: "Clear session" });
      dispatch(clearWalletConnector());
    }
  };
}
// call contract for component
export function callContract() {
  return (dispatch, getState) => {
    return EthereumService.callContract();
  };
}
// call contract for component
export function callContractTrustWallet() {
  return (dispatch, getState) => {
    return EthereumService.callContractTrustWallet();
  };
}
// call web3 for component
export function callWeb3() {
  return (dispatch, getState) => {
    return EthereumService.callWeb3();
  };
}

export function loginUser(address) {
  return (dispatch, getState) => {
    dispatch(startLoading());
    // const { persist: { address } } = getState();
    return EthereumService.loginUser(address)
      .then(res => {
        dispatch(stopLoading());
        return res.data;
      }).catch(error => {
        dispatch(stopLoading());
        return { status: false };
      });
  };
}
// from database get total values
export function getTotalDB() {
  return (dispatch, getState) => {
    const {
      persist: { address }
    } = getState();
    return EthereumService.getTotalDB()
      .then(res => {
        dispatch(saveTotals(res.data));
      }).catch(error => {
        console.log(error);
      });
  };
}
// from database get register user per day values
export function registeredPerDay() {
  return (dispatch, getState) => {
    const {
      persist: { address }
    } = getState();
    return EthereumService.registeredPerDay()
      .then(res => {
        dispatch(saveRegistrationPerDay(res.data));
      }).catch(error => {
        console.log(error);
      });
  };
}

//Get lastUserId from contract
export function lastUserId() {
  return (dispatch, getState) => {
    // let state = getState();
    return EthereumService.lastUserId()
      .then(res => {
        let d = 0;
        if (parseInt(res) > 0) {
          d = parseInt(res) - 1;
        }
        // d += d + 200;//add extra 200 user
        dispatch(saveTotalParticipants(d));
      }).catch(error => {
        if (error) {
          toast.error(error.message);
        }
      });
  };
}
//Get idToAddress from contract
export function idToAddress(id) {
  return (dispatch, getState) => {
    // let state = getState();
    return EthereumService.idToAddress(id)
      .then(address => {
        return address;
      }).catch(error => {
        if (error) {
          toast.error(error.message);
        }
      });
  };
}
//Get addMissingTransaction from contract
export function addMissingTransaction(address) {
  return (dispatch) => {
    // let { persist: address } = getState();
    return EthereumService.addMissingTransaction(address);
  };
}

//get transaction of specified user
export function getUserTransaction(address, level = '', matrix = '') {
  return async (dispatch, getState) => {
    const {
      persist: { loginType },
    } = getState();
    try {
      if (loginType === 'metamask') {
        return await EthereumService.getUserTransactionNew(address, level, matrix);
      }
      if (loginType === 'trustwallet') {
        return await EthereumService.getUserTransactionNewSocket(address, level, matrix);
      }
    } catch (error) {
      console.log(error);
      dispatch(stopLoading());
    }
  };
}