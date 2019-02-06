import React from "react";
import Button from "components/CustomButtons/Button.jsx";

class MailboxList extends React.Component {
  render(){
    var mailbox_list = this.props.mailboxes.map(function(mailbox) {
      return (
        <Button
          key={mailbox.id}
          color="warning"
          className='add-button create outbox' 
          onClick={this.props.onSelectMailbox.bind(null, mailbox.id)}
        >
           {mailbox.name}
        </Button>
      );
    }.bind(this));

    return (
      <div className="mailboxes">
        <Button color="info" className='add-button create' onClick={this.props.onSelectCompose}>
          Compose
        </Button>
        {mailbox_list}
      </div>
    );
  }
}
export default MailboxList;
