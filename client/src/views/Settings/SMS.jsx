import React from "react";
import PropTypes from 'prop-types';

import axios from "axios";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import {convertCurrency} from 'currencies-exchange-rates';

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

  convertToCurrency = (value, currencyFrom, currencyTo) => {
    return convertCurrency(currencyFrom, currencyTo, value);
  }

  fetchBalance = () => {
    fetch('/settings/smsBalance')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      const result = json.result;
      let value = result && JSON.parse(json.result).value;
      
      const currency = this.state.currency;
      if (currency !== 'EUR') {
        convertCurrency('EUR', currency, value).then((newValue) => {
          console.log(newValue);
          value = Math.round((value + Number.EPSILON) * 100) / 100;
          newValue = Math.round((newValue + Number.EPSILON) * 100) / 100;
          value = value + ' EUR (' + newValue + ' ' + currency + ')';
          this.setState({
            smsbalance: value
          });
        });
      }
    });
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        smsapikey: json.settings.smsapikey,
        smsapisecret: json.settings.smsapisecret,
        smsnumber: json.settings.smsnumber,
        currency: json.settings.currency
      }, this.fetchBalance());
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
    
    axios({
      method: 'post',
      url: '/settings/sms/update',
      data: settings
    })
    .then(function(response, body) {
      if (response.status === 200)
        this.props.openNotification && this.props.openNotification();
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
              <CardHeader color="primary">
                {this.props.tabs}
                <p>SMS Service is provided by Vonage. <a href='https://www.vonage.com/' rel="noopener noreferrer" target="_blank" className="nexmo">Create an account</a> to obtain the credentials for this page.</p>
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
