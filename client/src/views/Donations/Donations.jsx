import React from "react";
import { connect } from "react-redux";
import Utils from "../utils/Utils";

import './Donations.css'
import EnvelopeList from './EnvelopeList.jsx'
import Statements from './Statements.jsx'
import CreateEnvelope from './CreateEnvelope.jsx'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddDonation from "./AddDonation";

class Donations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'envelopes',
      openDonation: false
    };
  }

  onRowMouseOver = (memberId) => {

  };

  handleDonation = (toggle) => {
    this.setState({
      openDonation: toggle
    });
  }

  handleTabChange = (event, value) => {
    if (value === 'add-donation') {
      this.handleDonation(true);
    } else {
      this.setState({ tabValue: value });
    }
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
        <Tab
          value='add-donation'
          disableRipple
          label="ADD DONATION"
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
        <AddDonation open={this.state.openDonation} memberId={this.props.account.memberid} onClose={() => this.handleDonation(false)} />
        {this.state.tabValue === 'create-envelope' && Utils.isMoneyHandler(this.props.account.role) && <CreateEnvelope tabs={this.getTabs()} />}
      </div>
    );
  }
}

export default connect(
  ({ account }) => ({ account }),
  null
)(Donations);
