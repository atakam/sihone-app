import React from "react";

import TabContainer from 'components/TabContainer/TabContainer.jsx';

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
      notificationOpen: false
    };
  }

  onRowMouseOver = (memberId) => {

  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  componentWillMount () {
    const view = new URL(window.location.href).searchParams.get("view");
    this.setState({
      tabValue: view || 'identity'
    });
  }

  openNotification = () => {
    this.setState({
      notificationOpen: true
    });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false
    });
  }

  render () {
    const {
      notificationOpen
    } = this.state

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
        <Tabs
          className='tabs'
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          scrollable
          scrollButtons="on"
          indicatorColor="primary"
        >
          <Tab
            value='identity'
            disableRipple
            label="IDENTITY"
            icon={<Home />}
          />
          <Tab
            value='email'
            disableRipple
            label="EMAIL SETUP"
            icon={<Mail />}
          />
          <Tab
            value='sms'
            disableRipple
            label="SMS SETUP"
            icon={<Message />}
          />
          <Tab
            value='membership'
            disableRipple
            label="membership / Group"
            icon={<Person />}
          />
          <Tab
            value='finance'
            disableRipple
            label="Donations / Accounting"
            icon={<AttachMoney />}
          />
        </Tabs>
        {this.state.tabValue === 'identity' && <TabContainer>
          <Identity openNotification={this.openNotification} />
        </TabContainer>}
        {this.state.tabValue === 'email' && <TabContainer>
          <Email openNotification={this.openNotification} />
        </TabContainer>}
        {this.state.tabValue === 'sms' && <TabContainer>
          <SMS openNotification={this.openNotification} />
        </TabContainer>}
        {this.state.tabValue === 'membership' && <TabContainer>
          <Membership openNotification={this.openNotification} />
        </TabContainer>}
        {this.state.tabValue === 'finance' && <TabContainer>
          <Finance openNotification={this.openNotification} />
        </TabContainer>}
      </div>
    );
  }
}

export default Settings;
