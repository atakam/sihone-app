import React from "react";

import './Members.css'
import MembersList from './MembersList.jsx'
import FamilyList from './FamilyList.jsx'
import CreateMember from './CreateMember.jsx'
import ImportMembers from './ImportMembers.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Members extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: props.tabValue || 'members',
      membersCount: '',
      nonmembersCount: '',
      familiesCount: '',
      childrenCount: ''
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

  componentDidMount () {
    this.fetchNumbers();
  }

  fetchNumbers = () => {
    fetch('/member/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      const children = json.members.filter((member) => {
        if (member.birthdate) {
          const bdate = member.birthdate.split('T')[0].split('-');
          return Math.ceil((new Date() - new Date(Number(bdate[0]), Number(bdate[1])-1, Number(bdate[2]))) / (1000 * 3600 * 24)) / 365 < 18;
        } else return false;
      })
      this.setState({
        membersCount: json.members.length,
        childrenCount: children.length
      })
    })
    .catch(error => console.log('error', error));

    fetch('/member/findInactive')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        nonmembersCount: json.members.length
      })
    })
    .catch(error => console.log('error', error));

    fetch('/family/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        familiesCount: json.families.length
      })
    })
    .catch(error => console.log('error', error));
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
            value='members'
            disableRipple
            label={"ACTIVE MEMBERS (" + this.state.membersCount + ")"}
          />
          <Tab
            value='nonmembers'
            disableRipple
            label={"INACTIVE MEMBERS (" + this.state.nonmembersCount + ")"}
          />
          <Tab
            value='families'
            disableRipple
            label={"FAMILIES (" + this.state.familiesCount + ")"}
          />
          <Tab
            value='children'
            disableRipple
            label={"CHILDREN < 18 (" + this.state.childrenCount + ")"}
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
    );
  }

  render () {
    return (
      <div>
        {this.state.tabValue === 'members' && <MembersList active tabs={this.getTabs()} refreshNumbers={this.fetchNumbers} />}
        {this.state.tabValue === 'nonmembers' && <MembersList active={false} tabs={this.getTabs()} refreshNumbers={this.fetchNumbers}/>}
        {this.state.tabValue === 'families' && <FamilyList tabs={this.getTabs()} refreshNumbers={this.fetchNumbers}/>}
        {this.state.tabValue === 'children' && <MembersList active isChildren tabs={this.getTabs()} refreshNumbers={this.fetchNumbers}/>}
        {this.state.tabValue === 'create' && <CreateMember onSave={(e) => {this.handleTabChange(e, 'members')}} tabs={this.getTabs()} refreshNumbers={this.fetchNumbers}/>}
        {this.state.tabValue === 'import' && <ImportMembers onSave={(e) => {this.handleTabChange(e, 'members')}} tabs={this.getTabs()} refreshNumbers={this.fetchNumbers}/>}
      </div>
    );
  }
}

export default Members;
