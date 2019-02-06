import React from "react";

import AccountList from './AccountList.jsx'
import CreateAccount from './CreateAccount.jsx'
import TabContainer from 'components/TabContainer/TabContainer.jsx'

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

  render () {
    return (
      <div>
        <Tabs
          className='accounting-tabs'
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
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
        {this.state.tabValue === 'account' && <TabContainer>
          <AccountList />
        </TabContainer>}
        {this.state.tabValue === 'create-account' && <TabContainer>
          <CreateAccount />
        </TabContainer>}
      </div>
    );
  }
}

export default Accounting;
