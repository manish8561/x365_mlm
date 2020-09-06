import { actionTypes } from "../_actions/ethereum.action";

const initialState = {
  chainId: 0,
  address: "",
  walletConnector: {},
  totalIncome: 0,
  totalIncome3x: 0,
  totalIncome4x: 0,
  newUserPlaceLog: [],
  ethLevelPrice3x: [
    {
      "levelPrice": "0.025",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "0.05",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "0.1",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "0.2",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "0.4",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "0.8",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "1.6",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "3.2",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "6.4",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "12.8",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "25.6",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    },
    {
      "levelPrice": "51.2",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0
    }
  ],
  ethLevelPrice4x: [
    {
      "levelPrice": "0.025",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "0.05",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "0.1",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "0.2",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "0.4",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "0.8",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "1.6",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "3.2",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "6.4",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "12.8",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "25.6",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    },
    {
      "levelPrice": "51.2",
      "activeStatus": true,
      "reinvestStatus": [],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [

        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [

      ],
      "levelTwoUsers": [],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    }
  ],
  ethUserLevelPrice3x: [
    {
      "levelPrice": "0.025",
      "activeStatus": true,
      "reinvestStatus": [

      ],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [],
        "2": false
      },
      "userIncome": 0,
      "levelOneUsers": [],
      "partnersCount": 0,
      "userCounts": 0,
      "currentId": "0",
      "referrerId": ""
    }
  ],
  ethUserLevelPrice4x: [
    {
      "currentId": "1",
      "referrerId": "",
      "levelPrice": "0.025",
      "activeStatus": true,
      "reinvestStatus": [

      ],
      "userMatrix": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": [
        ],
        "2": [

        ],
        "3": false,
        "4": "0x0000000000000000000000000000000000000000"
      },
      "userIncome": 0,
      "levelOneUsers": [

      ],
      "levelTwoUsers": [

      ],
      "partnersCount": 0,
      "levelTwoArr": [
        {},
        {},
        {},
        {}
      ],
      "userCounts": 0
    }
  ],
  levelArr: [
    {
      level: "1",
      cost: "0.025"
    },
    {
      level: "2",
      cost: "0.05"
    },
    {
      level: "3",
      cost: "0.1"
    },
    {
      level: "4",
      cost: "0.2"
    },
    {
      level: "5",
      cost: "0.4"
    },
    {
      level: "6",
      cost: "0.8"
    },
    {
      level: "7",
      cost: "1.6"
    },
    {
      level: "8",
      cost: "3.2"
    },
    {
      level: "9",
      cost: "6.4"
    },
    {
      level: "10",
      cost: "12.8"
    },
    {
      level: "11",
      cost: "25.6"
    },
    {
      level: "12",
      cost: "51.2"
    }
  ]

};

const ethereum = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_WALLET_CONNECTOR:
      return {
        ...state,
        walletConnector: action.data.walletConnector,
        chainId: action.data.chainId,
        address: action.data.address
      };
    case actionTypes.SAVE_WALLET_DISCONNECTOR:
      return {
        ...state,
        walletConnector: {},
        chainId: 0,
        address: "",
      };
    case actionTypes.SAVE_LEVEL_3X:
      return {
        ...state,
        ethLevelPrice3x: action.data
      };
    case actionTypes.SAVE_LEVEL_4X:
      return {
        ...state,
        ethLevelPrice4x: action.data
      };
    case actionTypes.SAVE_USER_LEVEL_3X:
      return {
        ...state,
        ethUserLevelPrice3x: [action.data]
      };
    case actionTypes.SAVE_USER_LEVEL_4X:
      return {
        ...state,
        ethUserLevelPrice4x: [action.data]
      };
    case actionTypes.SAVE_LEVEL_TOTAL_INCOME:
      return {
        ...state,
        totalIncome: action.data.totalIncome,
        totalIncome3x: action.data.totalIncome3x,
        totalIncome4x: action.data.totalIncome4x,
      };

    case actionTypes.SAVE_NEW_USER_PLACE_LOG:
      return {
        ...state, newUserPlaceLog: action.data
      }

    default:
      return state;
  }
};

export default ethereum;
