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

  render () {
    return (
      <div>
        <Tabs
          className='tabs'
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
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
        {this.state.tabValue === 'members' && <TabContainer>
          <MemberReport />
        </TabContainer>}
        {this.state.tabValue === 'donations' && <TabContainer>
          <DonationReport />
        </TabContainer>}
        {this.state.tabValue === 'accounting' && <TabContainer>
          <AccountReport />
        </TabContainer>}
      </div>
    );
  }
}

export default Reporting;
