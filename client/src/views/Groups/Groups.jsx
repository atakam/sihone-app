import React from "react";

import GroupsList from './GroupsList.jsx'
import CreateGroup from './CreateGroup.jsx'

import TabContainer from 'components/TabContainer/TabContainer.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'group'
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
      tabValue: view || 'group'
    });
  }

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
            value='group'
            disableRipple
            label="GROUPS"
          />
          <Tab
            value='create'
            disableRipple
            label="CREATE GROUP"
          />
        </Tabs>
        {this.state.tabValue === 'group' && <TabContainer>
          <GroupsList />
        </TabContainer>}
        {this.state.tabValue === 'create' && <TabContainer>
          <CreateGroup />
        </TabContainer>}
      </div>
    );
  }
}

export default Groups;
