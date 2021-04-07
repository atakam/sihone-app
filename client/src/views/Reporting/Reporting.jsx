import React from "react";

import TabContainer from 'components/TabContainer/TabContainer.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MemberReport from "./MemberReport";
import DonationReport from "./DonationReport";
import AccountReport from "./AccountReport";

class Reporting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'members'
    };
  }

  onRowMouseOver = (memberId) => {

  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

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
          value='members'
          disableRipple
          label="MEMBERS, FAMILIES & GROUPS"
        />
        <Tab
          value='donations'
          disableRipple
          label="DONATIONS"
        />
        <Tab
          value='accounting'
          disableRipple
          label="ACCOUNTING"
        />
      </Tabs>
    );
  }

  render () {
    return (
      <div>
        {this.state.tabValue === 'members' && <MemberReport tabs={this.getTabs()} />}
        {this.state.tabValue === 'donations' && <DonationReport tabs={this.getTabs()} />}
        {this.state.tabValue === 'accounting' && <AccountReport tabs={this.getTabs()} />}
      </div>
    );
  }
}

export default Reporting;
