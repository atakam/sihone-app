import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/account";

class Logout extends Component {

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <div>Signing out ...</div>
    );
  }
}

export default connect(
  ({ account }) => ({ account }), 
  { logout }
)(Logout);
