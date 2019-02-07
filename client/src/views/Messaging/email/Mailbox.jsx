import React from "react";
import axios from "axios";
import Email from "./Email";
import EmailList from "./EmailList";
import NoneSelected from "./NoneSelected";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import AlertDialog from "components/Dialog/AlertDialog";

class Mailbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email_id: null,
      deleteAction: false,
      transactionToDelete: 0
    };
  }

  handleSelectEmail = (id) => {
    this.setState({ email_id: id });
  }

  getActions = () => {
    return [
      {
        type: 'delete',
        action: this.handleDelete,
        label: 'Delete'
      }
    ]
  }

  handleDelete = (emailid) => {
    this.setState({
      deleteAction: true,
      emailToDelete: emailid
    })
  }

  closeDelete = () => {
    this.setState({
      deleteAction: false
    })
  }

  deleteEmail = (emailid) => {
    axios({
      method: 'post',
      url: '/email/delete',
      data: { emailid }
    })
    .then(function(response, body) {
      this.closeDelete();
      this.props.onDelete && this.props.onDelete();
    }.bind(this));
  }

  render() {
    const email_id = this.state.email_id;
    let selected_email;
    if (email_id) {
      const mail = this.props.emails.filter(function(mail) {
        return mail.id === email_id;
      })[0];
      if (mail) {
        selected_email = <Email id={mail.id}
          from={mail.from}
          to={mail.to}
          subject={mail.subject}
          body={mail.body} />;
      }
    }
    if (!selected_email) {
      selected_email = <NoneSelected text="email" />;
    }

    return (
      <GridContainer>
        <AlertDialog
            open={this.state.deleteAction}
            onClose={this.closeDelete}
            onDecline={this.closeDelete}
            onAccept={() => this.deleteEmail(this.state.emailToDelete)}
            acceptLabel={'Accept'}
            declineLabel={'Decline'}
            dialogTitle={'Deleting Email'}
            dialogContent={'Are you sure you want to delete this email? This action is not reversible.'}
        />
        <EmailList emails={this.props.emails}
                   onSelectEmail={this.handleSelectEmail}
                   actions={this.getActions()}
                   />
        <GridItem xs={12} sm={7} md={7}>
          <div className="email">
            {selected_email}
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
export default Mailbox;
