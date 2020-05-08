import React from "react";

import AccountList from './AccountList.jsx'
import CreateAccount from './CreateAccount.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Accounting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'account'
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
      tabValue: view || 'account'
    });
  }

  getTabs = () => {
    return (
      <Tabs
        className='menu-tabs'
        value={this.state.tabValue}
        onChange={this.handleTabChange}
        classes={
          {indicator: 'tabs-indicator'}
        }
      >
        <Tab
          value='account'
          disableRipple
          label="ACCOUNTS"
        />
        <Tab
          value='create-account'
          disableRipple
          label="CREATE ACCOUNT"
        />
      </Tabs>
    );
  }

  render () {
    return (
      <div>
        {this.state.tabValue === 'account' && <AccountList tabs={this.getTabs()} />}
        {this.state.tabValue === 'create-account' && <CreateAccount tabs={this.getTabs()} />}
      </div>
    );
  }
}

export default Accounting;
