import React, { Component } from "react";
import { Table } from "semantic-ui-react";
// import { deleteCookie } from "../../_utils/index";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import { getUserTransaction, convertFromWei } from "../../redux/_actions/ethereum.action";

import imgIncom from '../../images/imgIncom.svg';
import { ETHERSCAN_URL } from "../../_constants";

export class Transactionpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
  }
  componentDidMount = async () => {
    this.callData();
  }

  callData = async () => {
    const { loggedIn, getUserTransaction, address } = this.props;
    if (loggedIn) {
      getUserTransaction(address).then(results => {
        this.setState({ results });
      });
    }
  }
  render() {
    let { results } = this.state;
    const { euroPrice } = this.props;
    return (

      <div className="contentArea">
        <div className="subHeader">
          {/* <ul className="menuList">
            <li><a href="#">Direct: {userReferralCount}  </a></li>
            <li><a href="#">Income: {totalIncome} ETH</a></li>
            <li><a href="#">Income After Topup: {incomeAfterTopUp} ETH </a></li>
          </ul> */}
          <div className="searchBlock">
            <input type="text" placeholder="Search" />
            <button className="btnSearch">
              <span>Search</span>
            </button>
          </div>
        </div>
        <div className="teamMain">
          <div className="teamRight">
            <div className="teamHeader notTeam">
              <img src={imgIncom} alt="icon" /> <h3> Transactions <small>({results.length})</small></h3>
            </div>
            <div className="studentOut" >

              <Table celled className="tableTransitionList">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Program</Table.HeaderCell>
                    <Table.HeaderCell>Platform</Table.HeaderCell>
                    <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                    <Table.HeaderCell>ETH / USD</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {results.length > 0 ? (results.map((data, index) => (
                    <Table.Row key={index}>
                      <Table.Cell data-label="Date">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false }).format((data.timestamp * 1000))}</Table.Cell>
                      <Table.Cell data-label="Transaction Upline" className="colAddress">{data.userId}</Table.Cell>
                      <Table.Cell data-label="Transaction Upline" className="colAddress">{data.level}</Table.Cell>
                      <Table.Cell data-label="Transaction Upline" className="colAddress">{data.matrix === "2" && "M4"}{data.matrix === "1" && "M3"}</Table.Cell>
                      <Table.Cell data-label="Transaction Hash" className="colAddress"><a href={`${ETHERSCAN_URL}tx/${data.transactionHash}`} target="_blank" title={data.transactionHash}>{data.transactionHash.substring(0, 15) + "..."}</a></Table.Cell>
                      {/* <Table.Cell data-label="Transaction Type" className="colAddress">{data.transactionType}</Table.Cell> */}
                      <Table.Cell data-label="ETH">{(data.amount)} / {(data.amount * euroPrice).toFixed(2)}</Table.Cell>
                      {/* <Table.Cell data-label="Message">{(data.message)}</Table.Cell> */}
                      {/* <Table.Cell data-label="Done By">{(data.loginType)}</Table.Cell> */}
                    </Table.Row>
                  ))) : (
                      <Table.Row key={0} style={{ textAlign: 'center' }}>
                        <Table.Cell colSpan="6" data-label="No recored">No record Found</Table.Cell>
                      </Table.Row>
                    )}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    loggedIn: state.persist.loggedIn,
    euroPrice: state.persist.euroPrice,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserTransaction: (userAddress, level, matrix) => dispatch(getUserTransaction(userAddress, level, matrix)),
    convertFromWei: (value) => dispatch(convertFromWei(value))
  };
};

export default (withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Transactionpage)
));
