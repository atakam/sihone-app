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

import './Settings.css';

class LiveStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtube: '',
      facebook: ''
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
        youtube: json.settings.youtube,
        facebook: json.settings.facebook
      });
    })
    .catch(error => console.log('error', error));
  }

  save = (event) => {
    event.preventDefault();
    const {
      youtube,
      facebook
    } = this.state

    const settings = {
      youtube,
      facebook
    }
    
    axios({
      method: 'post',
      url: '/settings/stream/update',
      data: settings
    })
    .then(function(response, body) {
      if (response.status === 200)
        this.props.openNotification && this.props.openNotification();
    }.bind(this));
  }

  render () {
    const {
      youtube,
      facebook
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
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Youtube URL"
                      id="youtube"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: youtube,
                        onChange: (e) => this.handleInputChange(e, 'youtube')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Facebook URL"
                      id="facebook"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: facebook,
                        onChange: (e) => this.handleInputChange(e, 'facebook')
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

LiveStream.propTypes = {
  openNotification: PropTypes.func
};

export default LiveStream;
