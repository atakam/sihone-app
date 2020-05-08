import React from "react";
import { connect } from "react-redux";

import Identity from './Identity.jsx';
import Email from './Email.jsx';
import SMS from './SMS.jsx';
import Membership from './Membership.jsx';
import Finance from './Finance.jsx';

import Home from "@material-ui/icons/Home";
import Person from "@material-ui/icons/Person";
import Mail from "@material-ui/icons/Mail";
import Message from "@material-ui/icons/Message";
import AttachMoney from "@material-ui/icons/AttachMoney";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Snackbar from "components/Snackbar/Snackbar.jsx";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'identity',
      notificationOpen: false,
      warningOpen: false
    };
  }

  onRowMouseOver = (memberId) => {

  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  componentWillMount () {
    const view = new URL(window.location.href).searchParams.get("view");
    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant');
    
    let tabValue = view || 'identity';
    if (!hasAccess) {
      tabValue = 'membership';
    }
    this.setState({
      tabValue
    });
  }

  openNotification = () => {
    this.setState({
      notificationOpen: true
    });
  }

  openWarning = (warningMessage) => {
    this.setState({
      warningOpen: true,
      warningMessage
    });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
      warningOpen: false
    });
  }

  getTabs = (hasAccess) => {
    return (
      <Tabs
        className='menu-tabs'
        value={this.state.tabValue}
        onChange={this.handleTabChange}
        scrollable
        scrollButtons="on"
        classes={
          {indicator: 'tabs-indicator'}
        }
      >
        {
          hasAccess && (
            <Tab
              value='identity'
              disableRipple
              label="IDENTITY"
              icon={<Home />}
            />
          )
        }
        {
          hasAccess && (
            <Tab
              value='email'
              disableRipple
              label="EMAIL SETUP"
              icon={<Mail />}
            />
          )
        }
        {
          hasAccess && (
            <Tab
              value='sms'
              disableRipple
              label="SMS SETUP"
              icon={<Message />}
            />
          )
        }
        <Tab
          value='membership'
          disableRipple
          label="membership / Group"
          icon={<Person />}
        />
        {
          hasAccess && (
            <Tab
              value='finance'
              disableRipple
              label="Donations / Accounting"
              icon={<AttachMoney />}
            />
          )
        }
      </Tabs>
    );
  }

  render () {
    const {
      notificationOpen,
      warningOpen,
      warningMessage
    } = this.state

    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant');

    return (
      <div>
        <Snackbar
          message={
            'SUCCESS - Settings Saved!'
          }
          close
          place="tc"
          color="success"
          open={notificationOpen}
          closeNotification={this.closeNotification}
        />
        <Snackbar
          message={warningMessage}
          close
          place="tc"
          color="warning"
          open={warningOpen}
          closeNotification={this.closeNotification}
        />
        {this.state.tabValue === 'identity' && hasAccess && <Identity openNotification={this.openNotification} tabs={this.getTabs(hasAccess)} />}
        {this.state.tabValue === 'email' && hasAccess && <Email openNotification={this.openNotification} openWarning={this.openWarning} tabs={this.getTabs(hasAccess)} />}
        {this.state.tabValue === 'sms' && hasAccess && <SMS openNotification={this.openNotification} tabs={this.getTabs(hasAccess)} />}
        {this.state.tabValue === 'membership' && <Membership openNotification={this.openNotification} tabs={this.getTabs(hasAccess)} />}
        {this.state.tabValue === 'finance' && hasAccess && <Finance openNotification={this.openNotification} tabs={this.getTabs(hasAccess)} />}
      </div>
    );
  }
}

export default connect(
  ({ account }) => ({ account }),
  null
)( Settings );
