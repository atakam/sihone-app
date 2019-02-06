import React from "react";

import EmailApp from './email/EmailApp.jsx';
import SmsApp from './sms/SmsApp.jsx';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import TabContainer from 'components/TabContainer/TabContainer.jsx'

class Messaging extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'email'
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  componentWillMount () {
    const view = new URL(window.location.href).searchParams.get("view");
    this.setState({
      tabValue: view || 'email'
    });
  }

  render () {
    return (
      <div>
        <Tabs
          className='messaging-tabs'
          value={this.state.tabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
        >
          <Tab
            value='email'
            disableRipple
            label="EMAIL"
          />
          <Tab
            value='sms'
            disableRipple
            label="SMS"
          />
        </Tabs>
        {this.state.tabValue === 'email' && <TabContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={'info'} className="card-header">
                  <p>You can email groups and members</p>
                </CardHeader>
                <CardBody>
                  <EmailApp />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </TabContainer>}
        {this.state.tabValue === 'sms' && <TabContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={'info'} className="card-header">
                  <p>You can message members with phone numbers</p>
                </CardHeader>
                <CardBody>
                  <SmsApp />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </TabContainer>}
      </div>
    );
  }
}

export default Messaging;
