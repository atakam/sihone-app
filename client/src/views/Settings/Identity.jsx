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

class Identity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      churchname : '',
      charitynumber : '',
      email : '',
      phone : '',
      currency : 'CAD',
      loaded: 0,
      streetaddress : '',
      city : '',
      province : '',
      postalcode : '',
      country : 'Canada',
      website : '',
      welcome : ''
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  componentDidMount () {
    this.fetchSettings();
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        churchname : json.settings.churchname,
        charitynumber : json.settings.charitynumber,
        email : json.settings.email,
        phone : json.settings.phone,
        currency : json.settings.currency,
        streetaddress : json.settings.streetaddress,
        city : json.settings.city,
        province : json.settings.province,
        postalcode : json.settings.postalcode,
        country : json.settings.country,
        website : json.settings.website,
        welcome : json.settings.welcome
      })
    })
    .catch(error => console.log('error', error));
  }

  save = (event) => {
    event.preventDefault();
    const {
      churchname,
      charitynumber,
      email,
      phone,
      currency,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      website,
      welcome
    } = this.state

    const settings = {
      churchname,
      charitynumber,
      email,
      phone,
      currency,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      website,
      welcome
    };

    axios({
      method: 'post',
      url: '/settings/identity/update',
      data: settings
    })
    .then(function(response, body) {
      this.props.openNotification && this.props.openNotification();
    });
  }

  render () {
    const currencies = [
      {
        value: 'CAD',
        label: '$ CAD',
      },
      {
        value: 'USD',
        label: '$ USD',
      }
    ];

    const {
      churchname,
      charitynumber,
      email,
      phone,
      currency,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      website,
      welcome
    } = this.state

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <p>Some of this information would be visible to members.</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Orgnanization Name"
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: churchname,
                        onChange: (e) => this.handleInputChange(e, 'churchname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email address"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: email,
                        onChange: (e) => this.handleInputChange(e, 'email')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Charity Number"
                      id="charity"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: charitynumber,
                        onChange: (e) => this.handleInputChange(e, 'charitynumber')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Phone Number"
                      id="phone-number"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: phone,
                        onChange: (e) => this.handleInputChange(e, 'phone')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="select-currency"
                      select
                      label="Select Currency"
                      margin="normal"
                      fullWidth
                      value={currency}
                      className="select-input"
                      onChange={(e) => this.handleInputChange(e, 'currency')}
                    >
                      {currencies.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Street Address"
                      id="address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: streetaddress,
                        onChange: (e) => this.handleInputChange(e, 'streetaddress')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="City"
                      id="city"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: city,
                        onChange: (e) => this.handleInputChange(e, 'city')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Province"
                      id="province"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: province,
                        onChange: (e) => this.handleInputChange(e, 'province')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Postal Code"
                      id="postal-code"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: postalcode,
                        onChange: (e) => this.handleInputChange(e, 'postalcode')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Country"
                      id="country"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: country,
                        onChange: (e) => this.handleInputChange(e, 'country')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Website"
                      id="website"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: website,
                        onChange: (e) => this.handleInputChange(e, 'website')
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                  
                    <CustomInput
                      labelText="Welcome message"
                      id="welcome"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5,
                        value: welcome,
                        onChange: (e) => this.handleInputChange(e, 'welcome')
                      }}
                    />
                  </GridItem>
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

Identity.propTypes = {
  openNotification: PropTypes.func
};

export default Identity;
