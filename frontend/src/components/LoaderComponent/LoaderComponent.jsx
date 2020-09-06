import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
class LoaderComponent extends Component {

  render() {
    if (this.props.loading.loading) {
      return (
        <div className="overlayDiv">
          <Loader
            type="Circles"
            color="#FFFFFF"
            height={60}
            width={60}
            visible={true}
          // timeout={5000} //3 secs
          />
        </div>
      );
    } else
      return <div></div>;
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading.meta
  };
};

export default connect(mapStateToProps)(LoaderComponent);
