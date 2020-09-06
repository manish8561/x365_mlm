import { fetch } from "./Fetch";
import {
  API_HOST, CONTRACT_ADDRESS, BLOCK_NUMBER,
  INFURA_URL
} from "../_constants";
// import { getCookie } from "../_utils";
import Web3 from "web3";
import { socket } from "../App";

import myContract from "../Assets/myContractABI.json";
// const feePercentage = 1;
// const contractAddress = '0xF29519514cf5A7f9bd2eF36b95653e46067f7Eb0';

//creating single infura contract object
const web3Global = new Web3(INFURA_URL);

const myInfuraContract = new web3Global.eth.Contract(
  myContract,
  CONTRACT_ADDRESS
);


const getIp = () => {
  return fetch("get", "https://ipv4.jsonip.com");
};

// const calculateFee = (value) => {
//   let v = parseFloat(value);
//   v += v * feePercentage / 100;
//   // console.log(value, v);
//   return v.toString();
// }

const callWeb3 = () => {
  return new Promise(async (resolve, reject) => {
    let web3 = new Web3(window.web3.currentProvider);
    const { ethereum } = window;
    if (ethereum) {
      const web3 = new Web3(ethereum);
      resolve(web3);
    } else if (window.web3) {
      // for truswallet
      web3 = new Web3(window.web3.currentProvider);
      resolve(web3);
    } else {
      reject(new Error("You have to install MetaMask !"));
    }
  });
};

const callContract = () => {
  return new Promise(async (resolve, reject) => {
    let web3 = new Web3(window.web3.currentProvider);
    const { ethereum } = window;

    if (ethereum) {
      const web3 = new Web3(ethereum);
      const myNewContract = await new web3.eth.Contract(
        myContract,
        CONTRACT_ADDRESS
      );
      resolve(myNewContract);
    } else if (window.web3) {
      // for truswallet
      web3 = new Web3(window.web3.currentProvider);
      const myNewContract = await new web3.eth.Contract(
        myContract,
        CONTRACT_ADDRESS
      );
      resolve(myNewContract);
    } else {
      reject(new Error("You have to install MetaMask !"));
    }
  });
};

const callContractTrustWallet = () => {
  return new Promise(async (resolve, reject) => {
    // let web3 = new Web3(window.web3.currentProvider);
    const { ethereum } = window;

    if (ethereum && ethereum.isMetaMask) {
      const web3 = new Web3(ethereum);
      const myNewContract = new web3.eth.Contract(
        myContract,
        CONTRACT_ADDRESS
      );
      resolve(myNewContract);
    } else {
      const web3 = new Web3(
        INFURA_URL
        // "wss://mainnet.infura.io/ws/v3/823bcfa6c3a44e12904a228a9909f3f2"
      );
      // const web3 = new Web3('https://3.21.162.137:8545');
      if (web3 !== undefined) {
        // const Id = await web3.eth.net.getId(); console.log('ID' + Id);
        const myNewContract = new web3.eth.Contract(
          myContract,
          CONTRACT_ADDRESS
        );
        resolve(myNewContract);
      } else {
        reject(new Error("Contract not created."));
      }
    }
  });
};

const lastUserId = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = myInfuraContract;
      if (contract) {
        contract.methods
          .lastUserId()
          .call()
          .then(result => {
            resolve(result);
          })
          .catch(reject);
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};
const getUsers = address => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = myInfuraContract;
      if (contract.methods) {
        contract.methods
          .users(address)
          .call()
          .then(result => {
            resolve(result);
          })
          .catch(reject);
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};

//estimate gas price
const estimateGasReg = (address, upline, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      if (contract.methods) {
        contract.methods.regUserExternal(upline).estimateGas({ from: address, value }).then(result => {
          resolve(result);
        }).catch(reject);
      } else {
        reject(new Error('Contract not found.'));
      }
    } catch (error) { reject(error) };
  });
};

const regUserExternal = (address, upline, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();

      const gasPrice = await estimateGasReg(address, upline, value);
      contract.methods
        .regUserExternal(upline)
        .send({ from: address, value, gas: gasPrice })
        .then(result => {
          resolve(result);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

// level price Meghraj
const levelPrice = (level) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = myInfuraContract;
      contract.methods
        .levelPrice(level)
        .call()
        .then(async result => {
          const r = await convertFromWei(result);
          resolve(r);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
//  end level price

const estimateGasBuyNewLevel = (address, value, matrix, level) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      if (contract.methods) {
        contract.methods.buyLevel(matrix, level).estimateGas({ from: address, value }).then(result => {
          // console.log(result, "gasprice");
          resolve(result);
        }).catch(reject);
      } else {
        reject(new Error('Contract not found.'));
      }
    } catch (error) { reject(error) };
  });
};

// Buy new level service Meghraj
const purchaseLevel = (address, v, matrix, level, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      let value = await convertToWei(v);
      // value = calculateFee(value);
      const contract = await callContract();
      const gasPrice = await estimateGasBuyNewLevel(address, value, matrix, level);

      contract.methods
        .buyLevel(matrix, level)
        .send({ from: address, value, gas: gasPrice })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
// End Buy new level service Meghraj


// usersZ3Matrix price Manish
const usersZ3Matrix = (userAddress, level) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = myInfuraContract;
      contract.methods
        .usersZ3Matrix(userAddress, level)
        .call()
        .then(result => {
          resolve(result);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

// usersZ4Matrix price Manish
const usersZ4Matrix = (userAddress, level) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = myInfuraContract;
      contract.methods
        .usersZ4Matrix(userAddress, level)
        .call()
        .then(result => {
          resolve(result);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
// idToAddress price Manish
const idToAddress = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = myInfuraContract;
      contract.methods
        .idToAddress(id)
        .call()
        .then(result => {
          resolve(result);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
const convertFromWei = (value, unit = "ether") => {
  return new Promise(async (resolve, reject) => {
    try {
      // const web3 = await callWeb3();
      const web3 = web3Global;
      const result = await web3.utils.fromWei(value, unit);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
const convertToWei = (value, unit = "ether") => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = await callWeb3();
      const result = await web3.utils.toWei(value, unit);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
const addMissingTransaction = address => {
  return fetch("get", `${API_HOST}Transaction/addMissingTransaction/${address}`, {});
};
const userIncomeDB = () => {
  return fetch("get", `${API_HOST}Transaction/userIncome`, {});
};
const reinvestLogDB = () => {
  return fetch("get", `${API_HOST}Transaction/reinvest`, {});
};
const getTotalDB = () => {
  return fetch("get", `${API_HOST}Transaction/getTotal`, {});
};
const registeredPerDay = () => {
  return fetch("get", `${API_HOST}Transaction/registeredPerDay`, {});
};
const getEuroPrice = () => {
  return fetch("get", `${API_HOST}Transaction/getEURValue`, {});
};
const getTransaction = (address, level = '', matrix = '') => {

  let url = `${API_HOST}Transaction/getAll/${address}?`;
  if (level) {
    url += `level=${level}`;
  }
  if (matrix) {
    url += `&matrix=${matrix}`;
  }
  return fetch("get", url, {});
};
const addTransaction = data => {
  return fetch("post", `${API_HOST}Transaction/add`, data);
};
const loginUser = address => {
  return fetch("get", `${API_HOST}Account/login/${address}`, {});
};


const reinvest = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const contract = await callContractTrustWallet();
      const contract = myInfuraContract;
      // const web3 = web3Global;
      if (contract) {
        contract.getPastEvents(
          "Recycle",
          {
            filter: {
              user: address,
              // matrix: matrix,
              // level: level
            },
            fromBlock: BLOCK_NUMBER
          },
          async (error, event) => {
            if (error) {
              // alert('reinvest log error' + error.message);
              return reject(error);
            }
            // console.log("logsXXXXXDDD :", event);

            if (event.length > 0) {
              let ResultArr = event.map((e, index) => {
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
          }
        );
      } else {
        setTimeout(() => {
          alert('trust wallet contract error');
        }, 2000);
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};
const userIncome = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const contract = await callContractTrustWallet();
      const contract = myInfuraContract;
      // const web3 = web3Global;
      if (contract) {
        contract.getPastEvents(
          "IncomeTransferred",
          {
            filter: {
              user: address
            },
            fromBlock: BLOCK_NUMBER
          },
          async (error, event) => {
            // console.log("userincome :", event);
            if (error) {
              // alert('userincome log error' + error.message);
              return reject(error);
            }

            if (event.length > 0) {
              let ResultArr = event.map((e, index) => {
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
          }
        );
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};
//gift income event
const missedRewardsReceived = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const contract = await callContractTrustWallet();
      const contract = myInfuraContract;
      // const web3 = web3Global;
      if (contract) {
        contract.getPastEvents(
          "MissedRewardsReceived",
          {
            filter: {
              receiver: address
            },
            fromBlock: BLOCK_NUMBER
          },
          async (error, event) => {
            // console.log("missedRewardsReceived :", event);
            if (error) {
              return reject(error);
            }

            if (event.length > 0) {
              let ResultArr = event.map((e) => e.returnValues);
              let results = await Promise.all(ResultArr);
              // console.log(results, r, 'results');
              resolve(results);
            } else {
              resolve([]);
            }
          }
        );
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};
//lost income event
const rewardsSent = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const contract = await callContractTrustWallet();
      const contract = myInfuraContract;

      if (contract) {
        contract.getPastEvents(
          "RewardsSent",
          {
            filter: {
              from: address
            },
            fromBlock: BLOCK_NUMBER
          },
          async (error, event) => {
            // console.log("rewardsSent :", event);
            if (error) {
              return reject(error);
            }

            if (event.length > 0) {
              let ResultArr = event.map((e) => e.returnValues);
              let results = await Promise.all(ResultArr);
              // console.log(results, r, 'results');
              resolve(results);
            } else {
              resolve([]);
            }
          }
        );
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};

//new referral event
const newReferral = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const web3 = web3Global;
      // const contract = await callContractTrustWallet();
      const contract = myInfuraContract;
      const web3 = web3Global;
      if (contract) {
        contract.getPastEvents(
          "NewReferral",
          {
            filter: {
              referrer: address
            },
            fromBlock: BLOCK_NUMBER
          },
          async (error, event) => {
            // console.log("new referral :", event);
            if (error) {
              return reject(error);
            }

            if (event.length > 0) {
              let ResultArr = event.map(async (e) => {
                const returnValues = e.returnValues;
                const block = await web3.eth.getBlock(e.blockNumber);
                returnValues.timestamp = block.timestamp;
                return returnValues;
              });
              let results = await Promise.all(ResultArr);
              // console.log(results, r, 'results');
              resolve(results);
            } else {
              resolve([]);
            }
          }
        );
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};
const getUserTransactionNew = async (address, level = '', matrix = '') => {
  // const contract = await callContractTrustWallet();
  // const web3 = await callWeb3();
  const contract = myInfuraContract;
  const web3 = web3Global;


  const usersZ3Matrix = (address, level) => {
    return new Promise(async (resolve, reject) => {
      try {
        contract.methods
          .usersZ3Matrix(address, level)
          .call()
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };

  const usersZ4Matrix = (address, level) => {
    return new Promise(async (resolve, reject) => {
      try {
        contract.methods
          .usersZ4Matrix(address, level)
          .call()
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };
  const getUsersNew = (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        contract.methods
          .users(address)
          .call()
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };
  const levelPriceNew = (level) => {
    return new Promise(async (resolve, reject) => {
      try {
        contract.methods
          .levelPrice(level)
          .call()
          .then(async result => {
            const r = await web3.utils.fromWei(result, "ether");
            resolve(r);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };
  const sortData = (arr, property) => {
    return arr.sort((a, b) => { return b[property] - a[property] });
  }

  return new Promise(async (resolve, reject) => {
    try {

      if (contract) {
        contract.getPastEvents(
          "NewReferral",
          {
            filter: {
              referrer: address
            },
            fromBlock: BLOCK_NUMBER
          },
          async (error, event) => {
            // console.log("NewReferral :", event);
            if (error) {
              // alert('userincome log error' + error.message);
              return reject(error);
            }

            if (event.length > 0) {
              const currentId = await getUsersNew(address).then(d => d.id);
              let reopenCount = 0;
              let ResultArr = [];
              if (level !== '' && matrix !== '') {
                ResultArr = event.filter(e => e.returnValues.level === level && e.returnValues.matrix === matrix);
              } else {
                ResultArr = event;
              }

              ResultArr = ResultArr.map(async (e) => {
                const returnValues = e.returnValues;
                returnValues.transactionHash = e.transactionHash;
                returnValues.blockNumber = e.blockNumber;

                const block = await web3.eth.getBlock(e.blockNumber);
                returnValues.timestamp = block.timestamp;

                returnValues.amount = await levelPriceNew(returnValues.level);
                const user = await getUsersNew(returnValues.user);
                returnValues.userId = user.id;

                let upOverflow = (returnValues.matrix === "2" && parseInt(currentId) > parseInt(user.id) && (user.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;
                let bottomOverflow = (returnValues.matrix === "2" && parseInt(currentId) < parseInt(user.id) && (user.referrer.toLowerCase() !== address.toLowerCase())) ? true : false;

                let ahead = false;

                if (returnValues.matrix === "1") { //3x
                  let aheadResults = await usersZ3Matrix(user.referrer, returnValues.level);
                  aheadResults = aheadResults[3];
                  if (!aheadResults) {
                    ahead = true;
                  }
                }

                if (returnValues.matrix === "2") { //4x
                  let aheadResults = await usersZ4Matrix(user.referrer, returnValues.level);
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

              let results2 = await sortData(results, 'timestamp');
              // console.log(results2, 'after sort');
              //to end with zero in the last 
              reopenCount--;
              results2 = results2.map(async (e) => {
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
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};
// socket fucntions reinvest log
const reinvestLogSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('reinvestLog', { address });
    socket.on('error', err => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on("reinvestLogRes", (res) => {
      resolve(res);
    });
  });
}
// socket fucntions userincome log
const userIncomeLogSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('userIncomeLog', { address });
    socket.on("userIncomeLogRes", (res) => {
      resolve(res);
    });
  });
}
// socket fucntions level price
const levelPriceSocket = (level) => {
  return new Promise((resolve, reject) => {
    socket.emit('levelPrice', { level });
    socket.on("levelPriceRes", (res) => {

      resolve(res);
    });
  });
}

// socket function for user xxx 
const usersZ3MatrixSocket = (address, level) => {
  return new Promise((resolve, reject) => {
    socket.emit('usersZ3Matrix', { address, level });
    socket.on("usersZ3MatrixRes", (res) => {
      // console.log(res[1][0], 'service');
      resolve(res);
    });
  });
}

// socket function for user xxxx
const usersZ4MatrixSocket = (address, level) => {
  return new Promise((resolve, reject) => {
    socket.emit('usersZ4Matrix', { address, level });
    socket.on("usersZ4MatrixRes", (res) => {
      resolve(res);
    });
  });
}
// socket function get users
const getUsersSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('users', { address });
    socket.on("usersRes", (res) => {
      resolve(res);
    });
  });
}
// socket function for arr userxxxmatrix
const usersZ3MatrixSocketArr = (address, levelArr) => {
  return new Promise((resolve, reject) => {
    socket.emit('usersZ3MatrixSocketArr', { address, levelArr });
    socket.on("usersZ3MatrixSocketArrRes", (res) => {
      // console.log(res[1][0], 'service');
      return resolve(res);
    });
  });
}

// socket function for arr userxxxx matrix
const usersZ4MatrixSocketArr = (address, levelArr) => {
  return new Promise((resolve, reject) => {
    socket.emit('usersZ4MatrixSocketArr', { address, levelArr });
    socket.on("usersZ4MatrixSocketArrRes", (res) => {
      // console.log(res[1][0], 'service');
      return resolve(res);
    });
  });
}

// socket function for level one users array home page
const levelOneUsers = (arr, levelArr, currentId) => {
  return new Promise((resolve, reject) => {
    socket.emit('levelOneUsers', { arr, levelArr, currentId });
    socket.on("levelOneUsersRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for level two users array home page
const levelTwoArr = (arr, levelArr, currentId, address) => {
  return new Promise((resolve, reject) => {
    socket.emit('levelTwoArr', { arr, levelArr, currentId, address });
    socket.on("levelTwoArrRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for 3x user level page to create array
const userLevel3xOneUsers = (arr, currentId, level) => {
  return new Promise((resolve, reject) => {
    socket.emit('userLevel3xOneUsers', { arr, currentId, level });
    socket.on("userLevel3xOneUsersRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for 4x user level page to create array
const userLevel4xOneUsers = (arr, currentId, level, address) => {
  return new Promise((resolve, reject) => {
    socket.emit('userLevel4xOneUsers', { arr, currentId, level, address });
    socket.on("userLevel4xOneUsersRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for getUserTransactionNew to create array
const getUserTransactionNewSocket = (address, level, matrix) => {
  return new Promise((resolve, reject) => {
    socket.emit('getUserTransactionNew', { address, level, matrix });
    socket.on("getUserTransactionNewRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for missedRewardsReceived to create array
const missedRewardsReceivedSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('missedRewardsReceived', { address });
    socket.on("missedRewardsReceivedRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for rewardSent to create array
const rewardsSentSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('rewardsSent', { address });
    socket.on("rewardsSentRes", (res) => {
      return resolve(res);
    });
  });
}
// socket function for rewardSent to create array
const newReferralSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('newReferral', { address });
    socket.on("newReferralRes", (res) => {
      return resolve(res);
    });
  });
}


//exporting
export const EthereumService = {
  getIp,
  getTotalDB,
  idToAddress,
  registeredPerDay,
  getEuroPrice,
  addTransaction,
  getTransaction,
  getUsers,
  callContract,
  regUserExternal,
  lastUserId,
  callWeb3,
  convertFromWei,
  purchaseLevel,
  callContractTrustWallet,
  loginUser,
  levelPrice,
  reinvest,
  usersZ3Matrix,
  usersZ4Matrix,
  userIncome,
  userIncomeDB,
  reinvestLogDB,
  reinvestLogSocket,
  userIncomeLogSocket,
  usersZ3MatrixSocket,
  usersZ4MatrixSocket,
  levelPriceSocket,
  getUsersSocket,
  usersZ3MatrixSocketArr,
  usersZ4MatrixSocketArr,
  userLevel3xOneUsers,
  userLevel4xOneUsers,
  levelOneUsers,
  levelTwoArr,
  addMissingTransaction,
  getUserTransactionNew,
  getUserTransactionNewSocket,
  missedRewardsReceived,
  rewardsSent,
  missedRewardsReceivedSocket,
  rewardsSentSocket,
  newReferral,
  newReferralSocket
};
