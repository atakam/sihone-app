import React from "react";

class NoneSelected extends React.Component {
  render(){
    return (
      <div className="none-selected alert alert-warning" role="alert">
        <span>No {this.props.text} selected.</span>
      </div>
    );
  }
}
export default NoneSelected;
