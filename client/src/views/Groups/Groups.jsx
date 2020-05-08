import React from "react";

import GroupsList from './GroupsList.jsx'
import CreateGroup from './CreateGroup.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'group',
      groupCount: ''
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

  componentDidMount () {
    this.fetchNumbers();
  }

  fetchNumbers = () => {
    fetch('/group/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        groupCount: json.groups.length
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
          value='group'
          disableRipple
          label={"GROUPS (" + this.state.groupCount + ")"}
        />
        <Tab
          value='create'
          disableRipple
          label="CREATE GROUP"
        />
      </Tabs>
    );
  }

  render () {
    return (
      <div>
        
        {this.state.tabValue === 'group' && <GroupsList tabs={this.getTabs()} refreshNumbers={this.fetchNumbers} />}
        {this.state.tabValue === 'create' && <CreateGroup tabs={this.getTabs()} refreshNumbers={this.fetchNumbers} />}
      </div>
    );
  }
}

export default Groups;
