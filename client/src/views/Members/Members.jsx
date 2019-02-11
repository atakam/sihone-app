import React from "react";

import './Members.css'
import MembersList from './MembersList.jsx'
import FamilyList from './FamilyList.jsx'
import CreateMember from './CreateMember.jsx'
import ImportMembers from './ImportMembers.jsx'
import TabContainer from 'components/TabContainer/TabContainer.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Members extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: props.tabValue || 'members'
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  componentWillMount () {
    const view = new URL(window.location.href).searchParams.get("view");
    this.setState({
      tabValue: view || 'members'
    });
  }

  render () {
    return (
      <div>
        <Tabs
          className='members-tabs'
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
        >
          <Tab
            value='members'
            disableRipple
            label={"ACTIVE MEMBERS"}
          />
          <Tab
            value='nonmembers'
            disableRipple
            label={"INACTIVE MEMBERS"}
          />
          <Tab
            value='families'
            disableRipple
            label={"FAMILIES"}
          />
          <Tab
            value='children'
            disableRipple
            label={"CHILDREN < 18"}
          />
          <Tab
            value='create'
            disableRipple
            label="Add Member"
          />
          <Tab
            value='import'
            disableRipple
            label="Import Members"
          />
        </Tabs>
        {this.state.tabValue === 'members' && <TabContainer>
          <MembersList active/>
        </TabContainer>}
        {this.state.tabValue === 'nonmembers' && <TabContainer>
          <MembersList active={false} />
        </TabContainer>}
        {this.state.tabValue === 'families' && <TabContainer>
          <FamilyList />
        </TabContainer>}
        {this.state.tabValue === 'children' && <TabContainer>
          <MembersList isChildren />
        </TabContainer>}
        {this.state.tabValue === 'create' && <TabContainer>
          <CreateMember onSave={(e) => {this.handleTabChange(e, 'members')}} />
        </TabContainer>}
        {this.state.tabValue === 'import' && <TabContainer>
          <ImportMembers onSave={(e) => {this.handleTabChange(e, 'members')}} />
        </TabContainer>}
      </div>
    );
  }
}

export default Members;
