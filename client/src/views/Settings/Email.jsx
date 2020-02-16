import React from "react";
import PropTypes from 'prop-types';
import axios from "axios";
// @material-ui/core components
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
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

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smtpname: '',
      smtpemail: '',
      smtphost: '',
      smtpuser: '',
      smtppass: '',
      smtpport: '',
      smtpsecure: 'SSL',
      emailfooter: ''
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  componentDidMount() {
    this.fetchSettings();
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        smtpname: json.settings.smtpname,
        smtpemail: json.settings.smtpemail,
        smtphost: json.settings.smtphost,
        smtpuser: json.settings.smtpuser,
        smtppass: json.settings.smtppass,
        smtpport: json.settings.smtpport,
        smtpsecure: json.settings.smtpsecure,
        emailfooter: json.settings.emailfooter
      })
    })
    .catch(error => console.log('error', error));
  }

  save = (event) => {
    event.preventDefault();
    const {
      smtpname,
      smtpemail,
      smtphost,
      smtpuser,
      smtppass,
      smtpport,
      smtpsecure,
      emailfooter
    } = this.state

    const settings = {
      smtpname,
      smtpemail,
      smtphost,
      smtpuser,
      smtppass,
      smtpport,
      smtpsecure,
      emailfooter
    }

    axios({
      method: 'post',
      url: '/settings/email/update',
      data: settings
    })
    .then(function(response, body) {
      if (response.status === 200) {
        this.props.openNotification && this.props.openNotification();
      }
    }.bind(this));
  }

  isMandatory = () => {
    const {
      smtpemail,
      smtphost,
      smtpuser,
      smtppass,
      smtpport
    } = this.state;
    return smtpemail !== "" || smtphost !== "" || smtpuser !== "" || smtppass !== "" || smtpport !== "";
  }

  render () {
    const security = [
      {
        value: 'SSL',
        label: 'SSL',
      },
      {
        value: 'TLS',
        label: 'TLS',
      }
      ,
      {
        value: 'None',
        label: 'None',
      }
    ];

    const {
      smtpname,
      smtpemail,
      smtphost,
      smtpuser,
      smtppass,
      smtpport,
      smtpsecure,
      emailfooter
    } = this.state

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <p>Email setup must be done before the system can send any email.</p>
                <p><i>Will use JadeSoft default settings if a field is left empty.</i></p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Name From"
                      id="email-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smtpname,
                        onChange: (e) => this.handleInputChange(e, 'smtpname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email From"
                      id="email-email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smtpemail,
                        onChange: (e) => this.handleInputChange(e, 'smtpemail'),
                        required: this.isMandatory()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Host"
                      id="email-host"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smtphost,
                        onChange: (e) => this.handleInputChange(e, 'smtphost'),
                        required: this.isMandatory()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Username"
                      id="email-username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smtpuser,
                        onChange: (e) => this.handleInputChange(e, 'smtpuser'),
                        required: this.isMandatory()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Password"
                      id="email-password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smtppass,
                        onChange: (e) => this.handleInputChange(e, 'smtppass'),
                        required: this.isMandatory()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Port"
                      id="email-port"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: smtpport,
                        onChange: (e) => this.handleInputChange(e, 'smtpport'),
                        required: this.isMandatory()
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      id="email-secure"
                      select
                      label="Security Type"
                      margin="normal"
                      fullWidth
                      className="select-input"
                      value={smtpsecure}
                      onChange={(e) => this.handleInputChange(e, 'smtpsecure')}
                    >
                      {security.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                  
                    <CustomInput
                      labelText="Email Footer"
                      id="email-footer"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 2,
                        value: emailfooter,
                        onChange: (e) => this.handleInputChange(e, 'emailfooter')
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <span/>
                <Button className="right" color="info" onClick={this.save}>Save</Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Email.propTypes = {
  openNotification: PropTypes.func
};

export default Email;
