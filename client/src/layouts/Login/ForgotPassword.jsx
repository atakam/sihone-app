import React, { Component } from "react";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import logo from "assets/img/logo.png";
import Footer from "../Footer/Footer";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      message: '',
      error: ''
    };
  }

  handleInputChange = (event, state) => {
    this.setState({
      [state]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      email
    } = this.state;

    fetch(`/member/forgot/${email}`)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        message: json.message,
        error: json.error
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ marginTop: '120px'}}>
        <GridContainer>
          <GridItem xs={1} sm={2} md={4}>
          </GridItem>
          <GridItem xs={10} sm={8} md={4}>
            <div className='login-logo'>
              <img src={logo} alt={'LOGO'} />
            </div>
            <Card>
              <CardHeader color="warning">
                <h4>Forgot Password</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type:"email",
                        value: this.state.email,
                        onChange: (e) => this.handleInputChange(e, 'email'),
                        required: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="info" className='add-button create' onClick={this.props.toggleLoginAndForgotPassword}>
                  Login
                </Button>
                <Button color="warning" className='add-button create'  type='submit'>
                  Submit
                </Button>
              </CardFooter>
            </Card>
            </GridItem>
            <GridItem xs={1} sm={2} md={4}>
          </GridItem>
        </GridContainer>
        <div className={'forgot-password-message'}>{this.state.message}</div>
        <div className={'forgot-password-error'}>{this.state.error}</div>
        <Footer />
      </form>
    );
  }
}

export default ForgotPassword;
