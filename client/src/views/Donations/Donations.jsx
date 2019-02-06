import React from "react";
import { connect } from "react-redux";
import Utils from "../utils/Utils";

import './Donations.css'
import EnvelopeList from './EnvelopeList.jsx'
import Statements from './Statements.jsx'
import CreateEnvelope from './CreateEnvelope.jsx'
import TabContainer from 'components/TabContainer/TabContainer.jsx'

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

  render () {
    return (
      <div>
        <Tabs
          className='donations-tabs'
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
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
        {this.state.tabValue === 'envelopes' && Utils.isMoneyHandler(this.props.account.role) && <TabContainer>
          <EnvelopeList />
        </TabContainer>}
        {this.state.tabValue === 'statements' && <TabContainer>
          <Statements memberRole={this.props.account.role} memberId={this.props.account.memberid}/>
        </TabContainer>}
        {this.state.tabValue === 'create-envelope' && Utils.isMoneyHandler(this.props.account.role) && <TabContainer>
          <CreateEnvelope />
        </TabContainer>}
      </div>
    );
  }
}

export default connect(
  ({ account }) => ({ account }),
  null
)(Donations);
