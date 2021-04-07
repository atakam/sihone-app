import React from "react";

class NoneSelected extends React.Component {
  render(){
    return (
      <div>
        <dl className="meta dl-horizontal">
          <dt>Do {this.props.text} selected.</dt>
          <dd></dd>
          <br />
          <dt></dt>
          <dd></dd>
          <br />
        </dl>
        <div className="email-body"></div>
      </div>
    );
  }
}
export default NoneSelected;
