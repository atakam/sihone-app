import React from "react";

class Email extends React.Component {
  render(){
    return (
      <div>
        <dl className="meta dl-horizontal">
          <dt>To</dt>
          <dd>{this.props.to}</dd>
          <br />
          <dt>Subject</dt>
          <dd>{this.props.subject}</dd>
          <br />
        </dl>
        <div className="email-body" dangerouslySetInnerHTML={{__html: this.props.body}}></div>
      </div>
    )
  }
}
export default Email;
