import React, { Component } from "react";
import { connect } from "react-redux";
import "./Footer.scss";
import { List, Dropdown } from "semantic-ui-react";
// import logofooter from "../../image/logo-footer.svg";
import { withRouter } from "react-router";

class Footer extends Component {


  render() {
    const { merchant } = this.props;
    return (
      <div className="footer">
        {merchant.logo_url && (
          <h1 className="logoWrap">
            <img
              src={merchant.logo_url}
              alt={merchant.name}
              className="logoFooter"
            />
          </h1>
        )}

        <List>
          <List.Item>
            {" "}
            <p>{'Copyright © 2019-2020'}</p>
          </List.Item>
          <List.Item as="a" href={merchant.terms} target="_blank">
            {'Terms'}
          </List.Item>
          <List.Item as="a" href={merchant.privacy} target="_blank">
            {'Privacy'}
          </List.Item>
          <List.Item as="a" href={merchant.legal} target="_blank">
            {'Legal'}
          </List.Item>
          <List.Item as="a" href={merchant.contact} target="_blank">
            {'Contact'}
          </List.Item>
        </List>
      </div>
    );
  }
}
// logo_url
const mapStateToProps = state => {
  return {
    merchant: state.merchant.merchantDetails,
    userDetails: state.persist.userDetails
  };
};
const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer));
