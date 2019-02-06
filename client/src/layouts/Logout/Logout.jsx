import React, { Component } from "react";

class Logout extends Component {

  componentDidMount() {
    document.getElementById('logout').click();
  }

  render() {
    return (
      <div>Signing out ...</div>
    );
  }
}

export default Logout;
