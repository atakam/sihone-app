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
    );
  }

  render () {
    return (
      <div>
        {this.state.tabValue === 'email' &&
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={'warning'} className="card-header">
                  {this.getTabs()}
                </CardHeader>
                <CardBody>
                  <EmailApp />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>}
        {this.state.tabValue === 'sms' &&
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color={'warning'} className="card-header">
                  {this.getTabs()}
                </CardHeader>
                <CardBody>
                  <SmsApp />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>}
      </div>
    );
  }
}

export default Messaging;
