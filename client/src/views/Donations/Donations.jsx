import React from "react";
import { connect } from "react-redux";
import Utils from "../utils/Utils";

import './Donations.css'
import EnvelopeList from './EnvelopeList.jsx'
import Statements from './Statements.jsx'
import CreateEnvelope from './CreateEnvelope.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Donations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'envelopes'
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
      tabValue: Utils.isMoneyHandler(this.props.account.role) ? (view || 'envelopes') : 'statements'
    });
  }

  handleCreateEnvelope = () => {

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
      {
        Utils.isMoneyHandler(this.props.account.role) && 
        <Tab
          value='envelopes'
          disableRipple
          label="ENVELOPES"
        />
      }
        
        <Tab
          value='statements'
          disableRipple
          label="STATEMENTS"
        />

      {
        Utils.isMoneyHandler(this.props.account.role) && 
        <Tab
          value='create-envelope'
          disableRipple
          label="CREATE ENVELOPE"
        />
      }
        
      </Tabs>
    );
  }

  render () {
    return (
      <div>
        
        {this.state.tabValue === 'envelopes' && Utils.isMoneyHandler(this.props.account.role) && <EnvelopeList tabs={this.getTabs()} />}
        {this.state.tabValue === 'statements' && <Statements memberRole={this.props.account.role} memberId={this.props.account.memberid} tabs={this.getTabs()} />}
        {this.state.tabValue === 'create-envelope' && Utils.isMoneyHandler(this.props.account.role) && <CreateEnvelope tabs={this.getTabs()} />}
      </div>
    );
  }
}

export default connect(
  ({ account }) => ({ account }),
  null
)(Donations);
