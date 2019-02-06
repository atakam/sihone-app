import React from "react";
import PropTypes from 'prop-types';
import CONFIG from "../../configs";
import request from "request";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import './Settings.css';

class SMS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smsapikey: '',
      smsapisecret: '',
      smsnumber: '',
      smsbalance: ''
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  componentDidMount() {
    this.fetchSettings();
  }

  fetchSettings = () => {
    fetch(CONFIG.serverUrl+'/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        smsapikey: json.settings.smsapikey,
        smsapisecret: json.settings.smsapisecret,
        smsnumber: json.settings.smsnumber,
        smsbalance: json.settings.smsbalance
      });
    })
    .catch(error => console.log('error', error));
  }

  save = (event) => {
    event.preventDefault();
    const {
      smsapikey,
      smsapisecret,
      smsnumber,
      smsbalance
    } = this.state

    const settings = {
      smsapikey,
      smsapisecret,
      smsnumber,
      smsbalance
    }

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/settings/sms/update',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: settings
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.props.openNotification && this.props.openNotification();
      this.fetchSettings();
      console.log(body);
    }.bind(this));
  }

  render () {
    const {
      smsapikey,
      smsapisecret,
      smsnumber,
      smsbalance
    } = this.state

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <p>SMS Service is provided by Nexmo. <a href='https://www.nexmo.com/' rel="noopener noreferrer" target="_blank">Create an account</a> to obtain the credentials for this page.</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="API Key"
                      id="sms-key"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smsapikey,
                        onChange: (e) => this.handleInputChange(e, 'smsapikey')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="API Secret"
                      id="sms-secret"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smsapisecret,
                        onChange: (e) => this.handleInputChange(e, 'smsapisecret')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Phone Number"
                      id="sms-number"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smsnumber,
                        onChange: (e) => this.handleInputChange(e, 'smsnumber')
                      }}
                    />
                  </GridItem>
                  
                  {
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Balance"
                        id="sms-balance"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: smsbalance,
                          disabled: true
                        }}
                      />
                    </GridItem>
                  }
                </GridContainer>
              </CardBody>
              <CardFooter>
                <span />
                <Button className="right" color="info" onClick={this.save}>Save</Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

SMS.propTypes = {
  openNotification: PropTypes.func
};

export default SMS;
