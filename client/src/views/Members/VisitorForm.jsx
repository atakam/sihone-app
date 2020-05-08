import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
// @material-ui/core components
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// core components
import Checkbox from "components/CustomInput/CustomCheckbox.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

class CreateMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: '',
      marital: '',
      role: '',
      firstname: '',
      lastname: '',
      birthdate: '',
      email: '',
      phone: '',
      password: '',
      uid: '',
      membershipdate: '',
      familyid: '',

      subscribtion: false,
      familyname: '',
      familyemail: '',
      streetaddress: '',
      city: '',
      province: '',
      postalcode: '',
      country: '',
      homephone: '',

      existingFamily: props.memberId > 0,
      families: [],
      notificationOpen: false,
      notificationNewOpen: false,
      openFamily: 0,

      deleteAction: false,

      groups: [],
      allGroups: [],
      group: '',
      notificationRemoveOpen: false,

      notificationDeleteErrorOpen: false,

      notificationError: false,
      notificationErrorMessage: ''
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
    if (state === 'lastname') {
      this.setState({ familyname: event.target.value });
    }
  }

  subscribtionChange = (e, checked) => {
    this.setState({
      subscribtion: checked
    });
  }

  handleSaveNew = (event) => {
    event.preventDefault();
    const {
      gender,
      marital,
      role,
      subscribtion,
      firstname,
      lastname,
      birthdate,
      email,
      phone,
      password,
      uid,
      membershipdate,
      familyid,
      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone
    } = this.state

    const member = {
      gender,
      marital,
      memberrole: role,
      subscribtion,
      firstname,
      lastname,
      birthdate,
      email,
      phone,
      password,
      memberuid: uid,
      membershipdate,
      familyid,
      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone
    }

    axios({
      method: 'post',
      url: '/member/new',
      data: member
    })
    .then(function(response) {
      if (response.data && response.data.error) {
        this.setState({
          notificationError: true,
          notificationErrorMessage: response.data.message
        });
      }
      else if (response.status === 200) {
        this.setState({
          notificationOpen: true
        });
        this.reset();
      }
    }.bind(this));
  }

  reset = () => {
    !this.props.memberId && this.setState({
      gender: '',
      marital: '',
      role: '',
      subscribtion: false,
      firstname: '',
      lastname: '',
      birthdate: '',
      email: '',
      phone: '',
      password: '',
      uid: '',
      membershipdate: '',
      familyid: '',

      familyname: '',
      familyemail: '',
      streetaddress: '',
      city: '',
      province: '',
      postalcode: '',
      country: '',
      homephone: '',

      existingFamily: this.props.memberId > 0
    });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
    });
  }

  render () {
    const genderlist = [
      {
        value: 'not specified',
        label: 'Not Specified',
      },
      {
        value: 'female',
        label: 'Female',
      },
      {
        value: 'male',
        label: 'Male',
      }
    ];

    const {
      gender,
      subscribtion,
      firstname,
      lastname,
      email,
      phone,

      homephone,

      notificationOpen
    } = this.state;

    return (
      <form onSubmit={this.props.hasOwnProperty('memberId') ? this.handleSave : this.handleSaveNew}>
        <GridContainer>
          <Snackbar
            message={
              'SUCCESS - Save Successful!'
            }
            close
            place="tc"
            color="success"
            open={notificationOpen}
            closeNotification={this.closeNotification}
          />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Personal Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="firstname"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        autoFocus:this.props.hasOwnProperty('memberId') ? false : true,
                        value: firstname,
                        onChange: (e) => this.handleInputChange(e, 'firstname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="lastname"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: lastname,
                        onChange: (e) => this.handleInputChange(e, 'lastname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="select-gender"
                      select
                      label="Gender"
                      value={gender}
                      onChange={(e) => this.handleInputChange(e, 'gender')}
                      margin="normal"
                      fullWidth
                      className="select-input"
                    >
                      {genderlist.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type:"email",
                        value: email,
                        autoComplete: 'new-password',
                        onChange: (e) => this.handleInputChange(e, 'email')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Mobile Number"
                      id="mobile"
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
                    <CustomInput
                      labelText="Home Phone Number"
                      id="home-phone"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: homephone,
                        onChange: (e) => this.handleInputChange(e, 'homephone')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={this.subscribtionChange}
                          checked={subscribtion}
                        />
                      }
                      label="Subscribed to receive emails"
                      className="form-checkbox"
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                {
                  this.props.hasOwnProperty('memberId') ? (
                    <Button color="danger" className='add-button create' onClick={this.handleDelete}>
                      Delete
                    </Button>
                  ) : (
                    <span />
                  )
                }
                <Button color="info" className='add-button create'  type='submit'>
                  Save
                </Button>
              </CardFooter>
                
            </Card>
          </GridItem>
        </GridContainer>
      </form>
    );
  }
}

CreateMember.propTypes = {
  memberId: PropTypes.number,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

export default CreateMember;
