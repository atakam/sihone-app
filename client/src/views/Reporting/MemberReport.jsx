import React from "react";
import PropTypes from "prop-types";

import axios from "axios";
// @material-ui/core components
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Checkbox from "components/CustomInput/CustomCheckbox.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import Utils from "../utils/Utils";

class MemberReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 'any',
      marital: [],
      role: [],
      firstname: '',
      lastname: '',
      birthdateto: '',
      birthdatefrom: '',
      
      email: '',
      phone: '',
      password: '',
      uid: '',
      membershipdateto: '',
      membershipdatefrom: '',
      familyid: '',

      familyname: '',
      familyemail: '',
      streetaddress: '',
      city: '',
      province: '',
      postalcode: '',
      country: '',
      homephone: '',

      groupname: '',
      grouptype: '',

      existingFamily: props.memberId > 0,
      families: [],
      notificationOpen: false,
      notificationErrorOpen: false,
      openFamily: 0,

      deleteAction: false,

      notificationRemoveOpen: false,

      notificationDeleteErrorOpen: false,

      checkAll: false,
      firstNameCheck: false,
      lastNameCheck: false,
      genderCheck: false,
      birthCheck: false,
      maritalCheck: false,
      emailCheck: false,
      mobileCheck: false,
      muidCheck: false,
      roleCheck: false,
      memberDateCheck: false,

      fnameCheck: false,
      femailCheck: false,
      homePhoneCheck: false,
      streetCheck: false,
      cityCheck: false,
      provinceCheck: false,
      postalCheck: false,
      countryCheck: false,

      groupnameCheck: false,
      grouptypeCheck: false
    };
  }

  componentDidMount () {
    this.checkAll(null, true);
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleChangeMultiple = (event, state) => {
    const { value } = event.target;
    const _value = [];
    for (let i = 0, l = value.length; i < l; i += 1) {
      _value.push(value[i]);
    }
    this.setState({
      [state]: _value,
    });
  };

  handleOnCheck = (e, checked, state) => {
    this.setState({
      [state]: checked,
      checkAll: false
    });
  }

  checkAll = (e, checked) => {
    this.setState({
      checkAll: checked,
      firstNameCheck: checked,
      lastNameCheck: checked,
      genderCheck: checked,
      birthCheck: checked,
      maritalCheck: checked,
      emailCheck: checked,
      mobileCheck: checked,
      muidCheck: checked,
      roleCheck: checked,
      memberDateCheck: checked,

      fnameCheck: checked,
      femailCheck: checked,
      homePhoneCheck: checked,
      streetCheck: checked,
      cityCheck: checked,
      provinceCheck: checked,
      postalCheck: checked,
      countryCheck: checked,

      groupnameCheck: checked,
      grouptypeCheck: checked
    });
  }

  handleClear = () => {
    this.setState({
      gender: 'any',
      marital: [],
      role: [],
      firstname: '',
      lastname: '',
      birthdateto: '',
      birthdatefrom: '',
      email: '',
      phone: '',
      password: '',
      uid: '',
      membershipdatefrom: '',
      membershipdateto: '',
      familyid: '',

      familyname: '',
      familyemail: '',
      streetaddress: '',
      city: '',
      province: '',
      postalcode: '',
      country: '',
      homephone: '',

      groupname: false,
      grouptype: false,

      firstNameCheck: false,
      lastNameCheck: false,
      genderCheck: false,
      birthCheck: false,
      maritalCheck: false,
      emailCheck: false,
      mobileCheck: false,
      muidCheck: false,
      roleCheck: false,
      memberDateCheck: false,

      fnameCheck: false,
      femailCheck: false,
      homePhoneCheck: false,
      streetCheck: false,
      cityCheck: false,
      provinceCheck: false,
      postalCheck: false,
      countryCheck: false,

      groupnameCheck: false,
      grouptypeCheck: false
    });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
      notificationErrorOpen: false
    });
  }

  generateReport = () => {
    const {
      gender,
      marital,
      role,
      firstname,
      lastname,
      birthdateto,
      birthdatefrom,
      email,
      phone,
      uid,
      membershipdateto,
      membershipdatefrom,

      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone,

      groupname,
      grouptype,

      firstNameCheck,
      lastNameCheck,
      genderCheck,
      birthCheck,
      maritalCheck,
      emailCheck,
      mobileCheck,
      muidCheck,
      roleCheck,
      memberDateCheck,

      fnameCheck,
      femailCheck,
      homePhoneCheck,
      streetCheck,
      cityCheck,
      provinceCheck,
      postalCheck,
      countryCheck,

      groupnameCheck,
      grouptypeCheck
    } = this.state;

    axios({
      method: 'post',
      url: '/report/member',
      data: {
        gender,
        marital,
        role,
        firstname,
        lastname,
        birthdateto,
        birthdatefrom,
        email,
        phone,
        uid,
        membershipdateto,
        membershipdatefrom,
  
        familyname,
        familyemail,
        streetaddress,
        city,
        province,
        postalcode,
        country,
        homephone,

        groupname,
        grouptype,
  
        firstNameCheck,
        lastNameCheck,
        genderCheck,
        birthCheck,
        maritalCheck,
        emailCheck,
        mobileCheck,
        muidCheck,
        roleCheck,
        memberDateCheck,
  
        fnameCheck,
        femailCheck,
        homePhoneCheck,
        streetCheck,
        cityCheck,
        provinceCheck,
        postalCheck,
        countryCheck,

        groupnameCheck,
        grouptypeCheck
      }
    })
    .then(function(response) {
      this.setState({
        notificationOpen: true
      });
      Utils.exportCSVFile(response.data.header, response.data.report, 'members');
    }.bind(this));
  }

  render () {
    const genderlist = [
      {
        value: 'any',
        label: 'Any',
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

    const maritallist = [
      {
        value: 'single',
        label: 'Single',
      },
      {
        value: 'married',
        label: 'Married',
      }
      ,
      {
        value: 'divorced',
        label: 'Divorced',
      },
      {
        value: 'widow',
        label: 'Widow(er)',
      }
    ];

    const roles = [
      {
        value: 'administrator',
        label: 'Administrator',
      },
      {
        value: 'assistant',
        label: 'Administrative Assistant',
      },
      {
        value: 'accountant',
        label: 'Accountant',
      },
      {
        value: 'group',
        label: 'Group Administrator',
      },
      {
        value: 'member',
        label: 'Member',
      },
      {
        value: 'visitor',
        label: 'Visitor',
      }
    ];

    const {
      gender,
      marital,
      role,
      firstname,
      lastname,
      birthdateto,
      birthdatefrom,
      email,
      phone,
      uid,
      membershipdateto,
      membershipdatefrom,

      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone,

      groupname,
      grouptype,

      checkAll,
      firstNameCheck,
      lastNameCheck,
      genderCheck,
      birthCheck,
      maritalCheck,
      emailCheck,
      mobileCheck,
      muidCheck,
      roleCheck,
      memberDateCheck,

      fnameCheck,
      femailCheck,
      homePhoneCheck,
      streetCheck,
      cityCheck,
      provinceCheck,
      postalCheck,
      countryCheck,
      
      groupnameCheck,
      grouptypeCheck,

      notificationOpen,
      notificationErrorOpen
    } = this.state;

    const enabled = (
      firstNameCheck ||
      lastNameCheck ||
      genderCheck ||
      birthCheck ||
      maritalCheck ||
      emailCheck ||
      mobileCheck ||
      muidCheck ||
      roleCheck ||
      memberDateCheck ||
      fnameCheck ||
      femailCheck ||
      homePhoneCheck ||
      streetCheck ||
      cityCheck ||
      provinceCheck ||
      postalCheck ||
      countryCheck ||
      groupnameCheck ||
      grouptypeCheck
    );

    return (
      <form onSubmit={this.props.hasOwnProperty('memberId') ? this.handleSave : this.handleSaveNew}>
        <GridContainer>
          <Snackbar
            message={
              'SUCCESS - Report generated!'
            }
            close
            place="tc"
            color="success"
            open={notificationOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'ERROR - Error generating the report!'
            }
            close
            place="tc"
            color="danger"
            open={notificationErrorOpen}
            closeNotification={this.closeNotification}
          />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color={'success'} className="card-header">
                {this.props.tabs}
              </CardHeader>
              <CardBody>
                <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.checkAll(e, checked); }}
                          checked={checkAll}
                        />
                      }
                      label="Check All"
                      className="form-checkbox"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Member Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'firstNameCheck'); }}
                          checked={firstNameCheck}
                        />
                      }
                      label="First Name"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="firstname"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: firstname,
                        onChange: (e) => this.handleInputChange(e, 'firstname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'lastNameCheck'); }}
                          checked={lastNameCheck}
                        />
                      }
                      label="Last Name"
                      className="form-checkbox"
                    />
                    <CustomInput
                      id="lastname"
                      labelText="Filter"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: lastname,
                        onChange: (e) => this.handleInputChange(e, 'lastname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'genderCheck'); }}
                          checked={genderCheck}
                        />
                      }
                      label="Gender"
                      className="form-checkbox"
                    />
                    <TextField
                      id="select-gender"
                      select
                      label="Filter Gender"
                      value={gender}
                      onChange={(e) => this.handleInputChange(e, 'gender')}
                      margin="normal"
                      fullWidth
                      className="select-input flex-item"
                    >
                      {genderlist.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'birthCheck'); }}
                          checked={birthCheck}
                        />
                      }
                      label="Date of Birth"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter From"
                      id="dob"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"date",
                        value: birthdatefrom,
                        onChange: (e) => this.handleInputChange(e, 'birthdatefrom')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                    <CustomInput
                      labelText="Filter To"
                      id="dob"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"date",
                        value: birthdateto,
                        onChange: (e) => this.handleInputChange(e, 'birthdateto')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'maritalCheck'); }}
                          checked={maritalCheck}
                        />
                      }
                      label="Marital Status"
                      className="form-checkbox"
                    />
                    <TextField
                      id="select-marital"
                      select
                      SelectProps={{multiple: true}}
                      label="Filter Status"
                      value={marital}
                      onChange={(e) => this.handleChangeMultiple(e, 'marital')}
                      margin="normal"
                      fullWidth
                      className="select-input flex-item"
                    >
                      {maritallist.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'emailCheck'); }}
                          checked={emailCheck}
                        />
                      }
                      label="Email"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"email",
                        value: email,
                        autoComplete: 'new-password',
                        onChange: (e) => this.handleInputChange(e, 'email')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'mobileCheck'); }}
                          checked={mobileCheck}
                        />
                      }
                      label="Mobile Number"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter Number"
                      id="mobile"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: phone,
                        onChange: (e) => this.handleInputChange(e, 'phone')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'muidCheck'); }}
                          checked={muidCheck}
                        />
                      }
                      label="Member ID"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter ID"
                      id="memberId"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: uid,
                        onChange: (e) => this.handleInputChange(e, 'uid')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'roleCheck'); }}
                          checked={roleCheck}
                        />
                      }
                      label="Membership Role"
                      className="form-checkbox"
                    />
                    <TextField
                      id="select-role"
                      className="select-input flex-item"
                      select
                      SelectProps={{multiple: true}}
                      label="Filter Role"
                      value={role}
                      onChange={(e) => this.handleChangeMultiple(e, 'role')}
                      margin="normal"
                      fullWidth
                    >
                      {roles.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'memberDateCheck'); }}
                          checked={memberDateCheck}
                        />
                      }
                      label="Membership Date"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter From"
                      id="member-date"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"date",
                        value: membershipdatefrom,
                        onChange: (e) => this.handleInputChange(e, 'membershipdatefrom')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                    <CustomInput
                      labelText="Filter To"
                      id="member-date"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"date",
                        value: membershipdateto,
                        onChange: (e) => this.handleInputChange(e, 'membershipdateto')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Family Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'fnameCheck'); }}
                          checked={fnameCheck}
                        />
                      }
                      label="Family Name"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="familyname"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: familyname,
                        onChange: (e) => this.handleInputChange(e, 'familyname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'femailCheck'); }}
                          checked={femailCheck}
                        />
                      }
                      label="Family Email"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="familyemail"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: familyemail,
                        onChange: (e) => this.handleInputChange(e, 'familyemail')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'homePhoneCheck'); }}
                          checked={homePhoneCheck}
                        />
                      }
                      label="Home Phone Number"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="home-phone"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: homephone,
                        onChange: (e) => this.handleInputChange(e, 'homephone')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'streetCheck'); }}
                          checked={streetCheck}
                        />
                      }
                      label="Street Address"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="address"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: streetaddress,
                        onChange: (e) => this.handleInputChange(e, 'streetaddress')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'cityCheck'); }}
                          checked={cityCheck}
                        />
                      }
                      label="City"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="city"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: city,
                        onChange: (e) => this.handleInputChange(e, 'city')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'provinceCheck'); }}
                          checked={provinceCheck}
                        />
                      }
                      label="Province"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="province"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: province,
                        onChange: (e) => this.handleInputChange(e, 'province')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'postalCheck'); }}
                          checked={postalCheck}
                        />
                      }
                      label="Postal Code"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="postal-code"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: postalcode,
                        onChange: (e) => this.handleInputChange(e, 'postalcode')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'countryCheck'); }}
                          checked={countryCheck}
                        />
                      }
                      label="Country"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="country"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: country,
                        onChange: (e) => this.handleInputChange(e, 'country')
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Group Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'groupnameCheck'); }}
                          checked={groupnameCheck}
                        />
                      }
                      label="Group Name"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="groupname"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: groupname,
                        onChange: (e) => this.handleInputChange(e, 'groupname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'grouptypeCheck'); }}
                          checked={grouptypeCheck}
                        />
                      }
                      label="Group Type"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="grouptype"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: grouptype,
                        onChange: (e) => this.handleInputChange(e, 'grouptype')
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="danger" className='add-button create' onClick={this.handleClear}>
                  Clear
                </Button>
                <Button color="info" className='add-button create'  onClick={this.generateReport} disabled={!enabled}>
                  Generate
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </form>
    );
  }
}

MemberReport.propTypes = {
  memberId: PropTypes.number,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

export default MemberReport;
