import React from "react";

import Mailbox from "./Mailbox";
import MailboxList from "./MailboxList";
import ComposeEditor from "./ComposeEditor";
import Utils from '../../utils/Utils';

class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          mailbox_id: null,
          emails: []
        };
    }

    componentDidMount() {
      this.fetchEmails();
    }

    handleSelectMailbox = (id) => {
        this.setState({ mailbox_id: id });
        this.fetchEmails();
    }

    handleSelectCompose = () => {
        this.setState({ mailbox_id: null });
    }

    fetchEmails = () => {
      fetch('/email/findAll')
      .then(response => response.json())
      .then(json => {
        console.log('json', json);
        this.setState({
          emails: json.emails
        })
      })
      .catch(error => console.log('error', error));
    }

    getMailboxes = () => {

        let emails = [];
        let emailids = [];
        for (let i=0; i<this.state.emails.length; i++) {
          const email =  this.state.emails[i];
          let members = [];
          let groups = [];
          let specials = [];
          if (emailids.indexOf(email.id) >= 0) {
            continue;
          }
          emailids.push(email.id);
          let obj = {
            id: email.id,
            subject: email.subject || '',
            body: email.emailtext,
            date:  email.emaildate ? (email.emaildate.split('T')[0] + ' ' +  (email.emaildate.split('T')[1] ? email.emaildate.split('T')[1].split('.')[0] : '')) : ''
          };
          (email.firstname || email.lastname) && members.push(email.firstname + ' ' + email.lastname);
          email.groupname && groups.push(email.groupname);
          const t_specials = email.specials ? email.specials.replace(/{/g, '').replace(/}/g, '').replace(/"/g, '') : [];
          email.specials && specials.push(t_specials.split(',').map((special) => Utils.getPredefinedGroupLabel(special)));

          for (let j=0; j<this.state.emails.length; j++) {
            if (this.state.emails[j].id === email.id && i !== j) {
              const email2 =  this.state.emails[j];
              email2.firstname && members.push(email2.firstname + ' ' + email2.lastname);
              email2.groupname && groups.push(email2.groupname);
              const t_specials = email2.specials ? email2.specials.replace(/{/g, '').replace(/}/g, '').replace(/"/g, '') : [];
              email2.specials && email2.specials !== '' && specials.push(t_specials.split(',').map((special) => Utils.getPredefinedGroupLabel(special)));
            }
          }
          obj.to = (members.length > 0 ? " > " + Utils.arrayUnique(members).toString() : '') +
            (groups.length > 0 ? " > " + Utils.arrayUnique(groups).toString() : '')+
            ([].concat.apply([], specials).filter(Boolean).length > 0 ? " > " + Utils.arrayUnique(specials).toString() : '');
          emails.push(obj);
        }

        return [
            {
              id: 1,
              name: "Outbox",
              emails: emails
            }
          ];
    }
    
    render() {
        const mailbox_id = this.state.mailbox_id;
        const mailboxes = this.getMailboxes();
        let selected_mailbox;
        if (mailbox_id) {
          var mailbox = mailboxes.filter(function(mailbox) {
            return mailbox.id === mailbox_id;
          })[0];
          selected_mailbox = <Mailbox key={mailbox.id}
                                      emails={mailbox.emails}
                                      onDelete={this.fetchEmails}
                                      />;
        } else {
          selected_mailbox = <div className="editor-compose"><ComposeEditor /></div>;
        }
    
        return (
          <div className="app row email-row">
            <MailboxList mailboxes={mailboxes}
                         onSelectMailbox={this.handleSelectMailbox}
                         onSelectCompose={this.handleSelectCompose} />
            <div className="mailbox col-md-10">
              <div className="panel panel-default">
                <div className="panel-body">
                  {selected_mailbox}
                </div>
              </div>
            </div>
          </div>
        );
    }
}
export default Email;
