import React, { Component } from "react";
import "./User.scss";
import {
  Grid,
  Container,
  Form,
  Header,
  Image,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { HOME_ROUTE } from "../../_constants/index";
// import { Field, reduxForm, change } from "redux-form";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { toast } from "../../components/Toast/Toast";

import {
  getUserMetaMask,
  getUsers,
  regUserMetaMask,
  regUserTrustWallet,
  callWeb3,
  getUserTrustWallet,
  getEuroPrice,
  getTotalDB,
  registeredPerDay,
  idToAddress,
  lastUserId,
  addMissingTransaction
} from "../../redux/_actions/ethereum.action";
import { DEFAULT_ADDRESS } from "../../_constants";

import logo from "../../images/logo_10xZoom.png";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      // balance: 0,
      web3: {},
      chainId: "",
      walletConnector: {},
      accounts: [],
      userData: {},
      errorCss: "blockDiv",
      regUserCss: "blockDiv",
      loggedUser: "",
      upline: "",
      levelCost: "50000000000000000",
      loginType: "metamask"
    };
  }

  componentDidMount = () => {
    const {
      match: { params }, getEuroPrice, getTotalDB, registeredPerDay, lastUserId
    } = this.props;
    const { upline } = params;
    if (upline) {
      this.setState({ upline });
    }
    // if (loggedIn) {
    //   setTimeout(() => {
    //     history.push(`${HOME_ROUTE}auth/home`);
    //   }, 1000);
    // }
    getEuroPrice();
    getTotalDB();
    registeredPerDay();
    lastUserId();
  };

  isMetaMaskInstalled = async () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum, web3 } = window;
    const result = Boolean(ethereum && ethereum.isMetaMask);
    if (result) {
      //metamask
      this.setState({ loginType: "metamask" });
      return "metamask";
    } else if (web3) {
      // console.log(web3, "trustwallet");
      //trustwallet
      this.setState({ loginType: "trustwallet" });
      return "trustwallet";
    } else {
      alert("Install Metamask extension first!");
      return "none";
    }
  };

  formSubmit = async () => {
    const {
      callWeb3,
      getUsers,
      getUserMetaMask,
      getUserTrustWallet,
      history,
      regUserMetaMask,
      regUserTrustWallet,
      idToAddress
    } = this.props;
    let { loggedUser, levelCost, upline } = this.state;

    if (this.checkId(upline)) {
      return toast.error("Enter valid reference ID!");
    }

    const installed = await this.isMetaMaskInstalled();

    try {
      if (installed === "metamask") {
        const { ethereum } = window;
        ethereum
          .enable()
          .then(async accounts => {
            let address = accounts[0];
            if (loggedUser === "") {
              this.setState({ loggedUser: address });
            } else {
              if (this.checkId(loggedUser)) {
                return toast.error("Enter valid ID!");
              }
              if (loggedUser.length === 42) {
                address = loggedUser;
              } else {
                address = await idToAddress(loggedUser);
                this.setState({ loggedUser: '' });
                if (address === '0x0000000000000000000000000000000000000000') {
                  return toast.error("User not registered!");
                }
              }
            }
            if (upline.length !== 42) {
              upline = await idToAddress(upline);
              if (upline === '0x0000000000000000000000000000000000000000') {
                return toast.error("Reference not found!");
              }
            }

            if (upline.length === 42) {
              const uplineUser = await getUsers(upline);
              if (uplineUser && uplineUser.id === "0") {
                return toast.error("Reference not found!");
              } 
            } 
            //checking again address
            if (address.length !== 42) {
              return toast.error("Enter valid address!");
            }

            if (upline === address) {
              return toast.error("Reference must not equal to your address!");
            }
            if (upline.length !== 42) {
              return toast.error("Enter valid reference!");
            }


            const user = await getUserMetaMask(address);
            if (user) {
              
              if (user.id !== "0") {
                toast.error("User already exists!");
                setTimeout(() => {
                  history.push(`${HOME_ROUTE}auth/home`);
                }, 1000);
              } else {
                regUserMetaMask(address, upline, levelCost)
                  .then(user => {
                    // console.log("register succesfully.", user);
                    if (user) {
                      setTimeout(() => {
                        history.push(`${HOME_ROUTE}auth/home`);
                      }, 2000);
                    }
                  })
                  .catch(error => toast.error(error.message));
              }
            }
            this.setState({ userData: user });
          })
          .catch(err => console.log(err));
      }
      if (installed === "trustwallet") {
        const { web3 } = window;
        if (web3) {
          const web3 = await callWeb3();
          const accounts = await web3.eth.getAccounts();
          let address = accounts[0];
          if (loggedUser === "") {
            this.setState({ loggedUser: address });
          } else {
            if (this.checkId(loggedUser)) {
              return toast.error("Enter valid ID!");
            }
            if (loggedUser.length === 42) {
              address = loggedUser;
            } else {
              address = await idToAddress(loggedUser);
              this.setState({ loggedUser: '' });
              if (address === '0x0000000000000000000000000000000000000000') {
                return toast.error("User not registered!");
              }
            }
          }
          if (address.length !== 42) {
            return toast.error("Enter valid address!");
          }

          if (upline.length !== 42) {
            upline = await idToAddress(upline);
            if (upline === '0x0000000000000000000000000000000000000000') {
              return toast.error("Reference not found!");
            }
          }

          if (upline.length === 42) {
            const uplineUser = await getUsers(upline);
            if (uplineUser && uplineUser.id === "0") {
              return toast.error("Reference not found!");
            } 
          }

          if (upline.length !== 42) {
            upline = await idToAddress(upline);
          }
          if (upline === address) {
            return toast.error("Reference must not equal to your address!");
          }
          if (upline.length !== 42) {
            return toast.error("Enter valid reference !");
          }

          const user = await getUserTrustWallet(address);
          if (user) {
            if (user.id !== "0") {
              setTimeout(() => {
                history.push(`${HOME_ROUTE}auth/home`);
              }, 1000);
            } else {
              regUserTrustWallet(address, upline, levelCost)
                .then(user => {
                  if (user) {
                    setTimeout(() => {
                      history.push(`${HOME_ROUTE}auth/home`);
                    }, 2000);
                  }
                })
                .catch(error => toast.error(error.message));
            }
          }
        } else {
          alert("no wallet found");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //check login id
  checkId(id) {
    if (id.length === 0 || (id.length > 0 && isNaN(id))) {
      return true;
    }
    if (parseInt(id) <= 0) {
      return true;
    }
    return false;
  }
  loginTypeValue = () => {
    const { ethereum, web3 } = window;
    const result = Boolean(ethereum && ethereum.isMetaMask);
    if (result) {
      //metamask
      this.setState({ loginType: "metamask" });
      return "metamask";
    } else if (web3) {
      // console.log(web3, "trustwallet");
      //trustwallet
      this.setState({ loginType: "trustwallet" });
      return "trustwallet";
    } else {
      return "metamask";
    }
  }

  logIn = async () => {
    const {
      // callWeb3,
      getUserMetaMask,
      // getUserTrustWallet,
      history,
      // addMissingTransaction
      idToAddress
    } = this.props;
    const { loggedUser } = this.state;
    let address = '';
    if (this.checkId(loggedUser)) {
      return toast.error("Enter valid ID!");
    }

    try {
      if (loggedUser.length === 42) {
        address = loggedUser;
      } else {
        address = await idToAddress(loggedUser);
        this.setState({ loggedUser: '' });
        if (address === '0x0000000000000000000000000000000000000000') {
          return toast.error("User not found!");
        }
      }
      if (address.length !== 42) {
        return toast.error("Enter valid address !");
      }

      const loginType = this.loginTypeValue();

      const user = await getUserMetaMask(address, loginType);
      if (user) {
        if (user.id !== "0") {
          setTimeout(() => {
            // addMissingTransaction(address);
            history.push(`${HOME_ROUTE}auth/home`);
          }, 1000);
        } else {
          toast.error("User not found!");
        }
      }

      // if (installed === "metamask") {
      //   const { ethereum } = window;
      //   ethereum
      //     .enable()
      //     .then(async accounts => {
      //       let address = accounts[0];
      //       if (loggedUser === "") {
      //         this.setState({ loggedUser: address });
      //       } else {
      //         if (this.checkId(loggedUser)) {
      //           return toast.error("Enter valid ID!");
      //         }
      //         if (loggedUser.length === 42) {
      //           address = loggedUser;
      //         }

      //       }
      //       const user = await getUserMetaMask(address);
      //       if (user) {
      //         if (user.id !== "0") {
      //           setTimeout(() => {
      //             // addMissingTransaction(address);
      //             history.push(`${HOME_ROUTE}auth/home`);
      //           }, 1000);
      //         } else {
      //           toast.error("User not found!");
      //         }
      //       }
      //       this.setState({ userData: user });
      //     })
      //     .catch(err => console.log(err));
      // }
      // if (installed === "trustwallet") {
      //   const { web3 } = window;
      //   if (web3) {
      //     const web3 = await callWeb3();
      //     const accounts = await web3.eth.getAccounts();
      //     let address = accounts[0];
      //     if (loggedUser === "") {
      //       this.setState({ loggedUser: address });
      //     } else {
      //       if (this.checkId(loggedUser)) {
      //         return toast.error("Enter valid ID!");
      //       }
      //       if (loggedUser.length === 42) {
      //         address = loggedUser;
      //       }
      //     }
      //     const user = await getUserTrustWallet(address);
      //     if (user) {
      //       if (user.id !== "0") {
      //         setTimeout(() => {
      //           // addMissingTransaction(address);
      //           history.push(`${HOME_ROUTE}auth/home`);
      //         }, 1000);
      //       } else {
      //         toast.error("User not found!");
      //       }
      //     }
      //   } else {
      //     alert("no wallet found");
      //   }
      // }
    } catch (error) {
      toast.error(error.message);
    }
  };

  setUpline = () => {
    // this.setState({ upline: DEFAULT_ADDRESS });
    this.setState({ upline: "1" });
  };

  settingUpline = (event) => {
    this.setState({ upline: event.target.value });
    if (event.charCode === 13) {
      this.formSubmit();
    }
  }
  loginKeyCode = (event) => {
    if (event.charCode === 13) {
      this.logIn();
    }
  }


  render() {
    return (
      <Container fluid className="loginContainer">
        <Container className="main_loginForm">
          <Grid centered>
            <div>
              <Image src={logo} className="logoStyle" />
            </div>
          </Grid>

          <Grid columns={2} className="loginForm">
            <Grid.Column width="6" className="loginform_left">
              <Header
                as="h2"
                content="Login"
                subheader="with"
                className="loginTitle"
              />
              <Form>
                <Form.Field>
                  <input
                    placeholder="My Wallet Address"
                    onChange={event =>
                      this.setState({ loggedUser: event.target.value })
                    }
                    value={this.state.loggedUser}
                    onKeyPress={this.loginKeyCode}
                  />
                </Form.Field>
                <Form.Field className="loginBtn">
                  <button type="button" onClick={() => this.logIn()}>
                    LOG IN
                  </button>
                </Form.Field>
                <div className={this.state.errorCss}>
                  {this.state.checkingUser}
                </div>
              </Form>
              {/* <Header
                as='h4'
                content='Total Users'
                subheader={this.state.totalUsers}
                className="totalUsers"
              /> */}
            </Grid.Column>

            <Grid.Column width="10" className="loginform_Right">
              <Header as="h2" content="Register" className="regTitle" />
              <Form method="post" onSubmit={this.formSubmit}>
                <Form.Field>
                  <label>
                    Reference&nbsp;&nbsp;&nbsp;
                    <small>
                      (If don't have Reference{" "}
                      <Link to="#" onClick={() => this.setUpline()}>
                        click here
                      </Link>
                      )
                    </small>
                  </label>
                  <input
                    placeholder="Reference"
                    onChange={event => this.settingUpline(event)}
                    onKeyUp={event => this.settingUpline(event)}
                    // defaultValue={this.state.upline !== "" ? this.state.upline : ""}
                    value={this.state.upline !== "" ? this.state.upline : ""}
                  />
                  <p></p>
                </Form.Field>
                <Form.Field>
                  <label>My Address</label>
                  <input
                    // type="hidden"
                    placeholder="My Wallet Address"
                    // defaultValue={this.state.loggedUser}
                    onChange={event =>
                      this.setState({ loggedUser: event.target.value })
                    }
                    value={this.state.loggedUser}
                  />
                  <p></p>
                </Form.Field>
                <Form.Field className="regBtn">
                  <button type="submit" primary="true">
                    Sign Up
                  </button>
                </Form.Field>
                <div className={this.state.regUserCss}>
                  {this.state.message}
                </div>
              </Form>
              <Message
                className="messageTransaction"
                icon="inbox"
                header="Welcome to world of Decentralization."
              />
            </Grid.Column>
          </Grid>
        </Container>
      </Container>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserMetaMask: (address, loginType) => dispatch(getUserMetaMask(address, loginType)),
    getUserTrustWallet: address => dispatch(getUserTrustWallet(address)),
    getUsers: (loginType, address) => dispatch(getUsers(loginType, address)),
    regUserMetaMask: (address, upline, value) =>
      dispatch(regUserMetaMask(address, upline, value)),
    regUserTrustWallet: (address, upline, value) =>
      dispatch(regUserTrustWallet(address, upline, value)),
    callWeb3: () => dispatch(callWeb3()),
    getEuroPrice: () => dispatch(getEuroPrice()),
    getTotalDB: () => dispatch(getTotalDB()),
    registeredPerDay: () => dispatch(registeredPerDay()),
    idToAddress: (id) => dispatch(idToAddress(id)),
    lastUserId: () => dispatch(lastUserId()),
    addMissingTransaction: (address) => dispatch(addMissingTransaction(address)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
