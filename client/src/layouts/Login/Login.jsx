import React, { Component } from "react";
import { connect } from "react-redux";
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
import ForgotPassword from "./ForgotPassword";

import { signin } from "../../actions/account";

import fetchStates from "../../reducers/fetchStates";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",

      login: true
    };
  }

  componentDidMount() {
    window.location.href.indexOf('dashboard') < 0 && (window.location.href = '/dashboard');
  }

  handleInputChange = (event, state) => {
    this.setState({
      [state]: event.target.value
    });
  }

  toggleLoginAndForgotPassword = () => {
    this.setState({
      login: !this.state.login
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      email,
      password
    } = this.state;
    this.props.signin({email, password});
  }

  get Error() {
    if (this.props.account.status === fetchStates.error) {
      return <div className="login-error">{this.props.account.message}</div>
    }
  }

  render() {
    return (
      <span>
        {
          this.state.login ? (
          <form onSubmit={this.handleSubmit} style={{ marginTop: '120px'}}>
            <GridContainer>
              <GridItem xs={1} sm={2} md={4}>
              </GridItem>
              <GridItem xs={10} sm={8} md={4}>
                <div className='login-logo'>
                  <img src={logo} alt={'LOGO'} />
                </div>
                <Card>
                  <CardHeader color="info">
                    <h4>Login</h4>
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
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Password"
                          id="password"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: 'password',
                            value: this.state.password,
                            onChange: (e) => this.handleInputChange(e, 'password'),
                            required: true
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button color="warning" className='add-button create' onClick={this.toggleLoginAndForgotPassword}>
                      Forgot Password?
                    </Button>
                    <Button color="info" className='add-button create'  type='submit'>
                      Submit
                    </Button>
                  </CardFooter>
                </Card>
                </GridItem>
                <GridItem xs={1} sm={2} md={4}>
              </GridItem>
            </GridContainer>
            {this.Error}
            <Footer />
          </form>
          ) : (
            <ForgotPassword toggleLoginAndForgotPassword={this.toggleLoginAndForgotPassword} />
          )
        }
      </span>
    );
  }
}

export default connect(
  ({ account }) => ({ account }), 
  { signin }
)(Login);
