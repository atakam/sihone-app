import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
// @material-ui/core components
import Menu from '@material-ui/core/Menu';
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
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import AlertDialog from "components/Dialog/AlertDialog";
import Table from "components/Table/Table.jsx";
import Utils from "../utils/Utils";

import FamilyView from './FamilyView';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class CreateMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: '',
      marital: '',
      role: 'member',
      firstname: '',
      lastname: '',
      birthdate: '',
      email: '',
      phone: '',
      password: '',
      uid: '',
      membershipdate: '',
      familyid: '',

      subscribtion: true,
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
      active: true,
      notificationRemoveOpen: false,

      notificationDeleteErrorOpen: false,

      notificationError: false,
      notificationErrorMessage: '',

      showPassword: false
    };
  }

  componentDidMount () {
    this.fetchFamilies();
    this.fetchLastId()
    .then(() => {
      return this.fetchSettings();
    })
    .then(() => {
      this.props.memberId && this.fetchMember();
      this.props.memberId && this.fetchGroupsByMember();
      this.props.memberId && this.fetchGroups();
    });
  }

  fetchFamilies = () => {
    fetch('/family/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        families: json.families
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchSettings = () => {
    return fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        memberdefaultpassword: json.settings.memberdefaultpassword,
        memberidautomate: json.settings.memberidautomate,
        memberidprefix: json.settings.memberidprefix,
        churchname: json.settings.churchname,
        website: json.settings.website,
        emailfooter: json.settings.emailfooter
      });
      if (json.settings.memberidautomate && this.state.uid === '') {
        this.setState({
          uid: json.settings.memberidprefix + this.generateId()
        });
      }
    })
    .catch(error => console.log('error', error));
  }

  fetchGroups = () => {
    setTimeout(() => {
      fetch('/group/findAll')
      .then(response => response.json())
      .then(json => {
        console.log('json', json);
        this.setState({
          allGroups: json.groups
        })
      })
      .catch(error => console.log('error', error));
    }, 2000);
  }

  fetchLastId = () => {
    return fetch('/member/findLast',)
    .then(response => response.json())
    .then(json => {
      console.log('member', json.member);
      this.setState({
        lastid: json.member.id
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchMember = () => {
    fetch('/member/find/' + this.props.memberId,)
    .then(response => response.json())
    .then(json => {
      console.log('member', json.member);
      this.setState({
        gender: json.member.gender.toLowerCase(),
        marital: json.member.marital.toLowerCase(),
        role: json.member.memberrole.toLowerCase(),

        subscribtion: json.member.subscribtion,
        firstname: json.member.firstname,
        lastname: json.member.lastname,
        birthdate: json.member.birthdate ? json.member.birthdate.split('T')[0] : '',
        email: json.member.email,
        phone: json.member.phone,
        uid: json.member.memberuid === '' && this.state.memberidautomate ? this.state.memberidprefix + this.generateId(json.member.id) : json.member.memberuid,
        membershipdate: json.member.membershipdate ? json.member.membershipdate.split('T')[0] : '',
        familyid: json.member.familyid,
        active: json.member.active
      })
    })
    .catch(error => console.log('error', error));
  }

  generateId = (actualId) => {
    let id = actualId ? actualId : this.state.lastid+1;
    id = (id > 10 && id < 100 ? '0' : (id < 10 ? '00' : '')) + id;
    let d = new Date();
    d = '1' + d.toJSON().replace(/-/g, '').replace(/:/g, '').split('T')[0].slice(4) + 'J';
    return d + id;
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
    if (state === 'lastname') {
      this.setState({ familyname: event.target.value });
    }
  }

  familyOption = (e, checked) => {
    this.setState({
      existingFamily: checked
    });
  }

  subscribtionChange = (e, checked) => {
    this.setState({
      subscribtion: checked
    });
  }

  handleSave = (event) => {
    event.preventDefault();
    this.handleActionsClose();
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
      homephone,
      active
    } = this.state

    const member = {
      memberid: this.props.memberId,
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
      familyid: this.state.existingFamily ? familyid : null,
      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone,
      active
    }

    axios({
      method: 'post',
      url: '/member/update',
      data: member
    })
    .then(function(response) {
      if (response.data && response.data.error) {
        this.setState({
          notificationError: true,
          notificationErrorMessage: response.data.message
        });
      }
      else if (response.status === 200)
        this.setState({
          notificationOpen: true
        });
      
    }.bind(this));
  }

  handleSaveNew = (event) => {
    event.preventDefault();
    this.handleActionsClose();
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
      homephone,
      active,
      memberdefaultpassword
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
      password: password === '' ? memberdefaultpassword : password,
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
      homephone,
      active
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
          notificationNewOpen: true
        });
        this.sendWelcomeEmail();
        this.reset();
      }
    }.bind(this));
    this.props.refreshNumbers && this.props.refreshNumbers();
  }

  reset = () => {
    !this.props.memberId && this.setState({
      gender: '',
      marital: '',
      role: 'member',
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
      active: true,

      existingFamily: this.props.memberId > 0
    });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
      notificationNewOpen: false,
      notificationRemoveOpen: false,
      notificationDeleteErrorOpen: false,
      notificationError: false,
      notificationEmailOpen: false,
      notificationErrorMessage: ''
    });
  }

  handleViewFamily = (familyId) => {
    this.setState({ openFamily: familyId });
  }

  handleCloseFamily = () => {
    this.setState({ openFamily: 0 });
    this.fetchFamilies();
  }

  handleDelete = (event) => {
    event.preventDefault();
    this.setState({
      deleteAction: true
    })
  }

  closeDelete = () => {
    this.setState({
      deleteAction: false
    })
  }

  deleteAction = () => {
    const group = {
      memberid: this.props.memberId
    }

    axios({
      method: 'post',
      url: '/member/delete',
      data: group
    })
    .then(function(response, body) {
      const openError = response.status !== 200 || response.data.error;
      this.setState({
        notificationDeleteErrorOpen: openError,
        deleteAction: false
      });
      !openError && this.props.onClose && this.props.onClose();
    }.bind(this));
  }

  deleteGroupFromMember = (groupid) => {
    const membergroup = {
      groupid,
      memberid: this.props.memberId,
    }

    axios({
      method: 'post',
      url: '/group/removeGroup',
      data: membergroup
    })
    .then(function(response, body) {
      this.setState({
        notificationRemoveOpen: true,
        deleteAction: false,
        member: ''
      });
      this.fetchGroupsByMember();
    }.bind(this));
  }

  fetchGroupsByMember = () => {
    fetch('/group/findAll/m/' + this.props.memberId)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        groups: json.groups
      })
    })
    .catch(error => console.log('error', error));
  }

  handleAddMemberToGroup = () => {
    const membergroup = {
      groupid: this.state.group,
      memberid: this.props.memberId
    }

    axios({
      method: 'post',
      url: '/group/addMember',
      data: membergroup
    })
    .then(function(response, body) {
      this.setState({
        notificationAddOpen: true,
        member: ''
      });
      this.fetchGroupsByMember();
    }.bind(this));
  }

  handleActions = (event) => {
    this.setState({
      otherActionEl: event.currentTarget
    });
  }

  handleActionsClose = () => {
    this.setState({
      otherActionEl: null
    });
  };

  sendWelcomeEmail = () => {
    this.handleActionsClose();
    const {
      churchname,
      emailfooter,
      website,
      firstname,
      lastname,
      email,
      uid
    } = this.state;
    const subject = 'Welcome to ' + churchname;
    let welcome = "Hi " + firstname + " " + lastname + ",";
    welcome += "<br/>Member Id: " + uid;
    welcome += "<br/><br/>Welcome to the web portal of " + churchname + ".";
    welcome += "<br/><br/>You may access your profile from by going to the <a href='"+window.location.hostname+"'>web portal</a> with the following credentials.";
    welcome += "<br/>Email: " + email;
    welcome += "<br/>Password: <i>(If you do not know your password, click on <strong>Forgot Password</strong> on the web portal login page)</i>";
    welcome += "<br/><br/>Thanks,";
    welcome += "<br/>" + churchname;
    const template = Utils.getEmailTemplates(churchname, subject, emailfooter, website, `${website}/settings/logo`)[0];
    const message = template.before + welcome + template.after;
    const member = {
      email,
      subject,
      message
    }
    axios({
      method: 'post',
      url: '/email/welcome',
      data: member
    })
    .then(function(response, body) {
      this.setState({
        notificationEmailOpen: true
      });
    }.bind(this));
  }

  handleClickShowPassword = (value) => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

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

    const maritallist = [
      {
        value: 'not specified',
        label: 'Not Specified',
      },
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

    const families = this.state.families.map((family) => {
      let label = family.familyname;
      label += ' (';
      label += family.streetaddress ? family.streetaddress + ' ' : '';
      label += family.city ? family.city + ' ' : '';
      label += family.province ? family.province + ' ' : '';
      label += family.postalcode ? family.postalcode + ' ' : '';
      label += family.country ? family.country : '';
      label += ')';
      return {
        value: family.id,
        label: label
      }
    });

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
      homephone,

      existingFamily,
      notificationOpen,
      notificationNewOpen,
      notificationRemoveOpen,
      notificationDeleteErrorOpen,
      notificationError,
      notificationErrorMessage,
      notificationEmailOpen,

      groups,
      allGroups,
      group,

      active,

      memberidautomate,

      otherActionEl,

      showPassword
    } = this.state

    const excludes = groups.map((group) => group.id);

    let allGroupsModified = allGroups.map(group => {
      if (excludes.indexOf(group.id) < 0) {
        return group
      }
      return null;
    });

    allGroupsModified = allGroupsModified.filter((obj) => obj );

    const showFamily = familyid || !this.props.hasOwnProperty('memberId');

    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant' ||
      this.props.account.role === 'group');

    const actives = [
      {
        value: true,
        label: 'Active'
      },
      {
        value: false,
        label: 'Inactive'
      }
    ];

    const hasAdminAccess = (this.props.account.role === 'administrator');
    const hasSecureAccess = (this.props.account.role === 'administrator'|| 
      this.props.account.role === 'assistant');

    return (
      <form onSubmit={this.props.hasOwnProperty('memberId') ? this.handleSave : this.handleSaveNew}>
        <GridContainer>
          <Snackbar
            message={
              'SUCCESS - Update Successful!'
            }
            close
            place="tc"
            color="success"
            open={notificationOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'SUCCESS - Welcome email sent!'
            }
            close
            place="tc"
            color="success"
            open={notificationEmailOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              notificationErrorMessage
            }
            close
            place="tc"
            color="danger"
            open={notificationError}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'SUCCESS - New Member Created!'
            }
            close
            place="tc"
            color="success"
            open={notificationNewOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'SUCCESS - Group has been successfully!'
            }
            close
            place="tc"
            color="success"
            open={notificationRemoveOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'ERROR - Cannot delete Member. Donation entries may be attached to this user. Please delete those entries first!'
            }
            close
            place="tc"
            color="danger"
            open={notificationDeleteErrorOpen}
            closeNotification={this.closeNotification}
          />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              {
                this.props.hasOwnProperty('memberId') ? (
                  null
                ) : (
                  <CardHeader color={'warning'}>
                    {this.props.tabs}
                  </CardHeader>
                )
              }
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
                      labelText="Date of Birth"
                      id="dob"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type:"date",
                        value: birthdate,
                        onChange: (e) => this.handleInputChange(e, 'birthdate')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="select-marital"
                      select
                      label="Marital Status"
                      value={marital}
                      onChange={(e) => this.handleInputChange(e, 'marital')}
                      margin="normal"
                      fullWidth
                      className="select-input"
                    >
                      {maritallist.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: showPassword ? 'text' : 'password',
                        value: password,
                        autoComplete: 'new-password',
                        onChange: (e) => this.handleInputChange(e, 'password'),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={this.handleClickShowPassword.bind(this)}
                              onMouseDown={this.handleMouseDownPassword.bind(this)}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
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
                {
                  showFamily && (
                    <span>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <h6 className="form-subtitle">Family Information</h6>
                        </GridItem>
                        {
                          hasAccess && (
                            <GridItem xs={12} sm={12} md={4}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={this.familyOption}
                                    checked={existingFamily}
                                  />
                                }
                                label="Assign to Exisitng Family"
                                className="form-checkbox"
                              />
                            </GridItem>
                          )
                        }
                      </GridContainer>
                        
                        {
                          (existingFamily) && (
                            <GridContainer>
                              <GridItem xs={12} sm={8} md={10}>
                                <TextField
                                  id="select-family"
                                  select
                                  label="Choose Family"
                                  value={familyid}
                                  onChange={(e) => this.handleInputChange(e, 'familyid')}
                                  margin="normal"
                                  fullWidth
                                  className="select-input"
                                  disabled={!hasAccess}
                                >
                                  {families.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </GridItem>
                              <GridItem xs={12} sm={4} md={2}>
                                <div className='view-family-label'>
                                  <a onClick={() => this.handleViewFamily(familyid)}>
                                      View Family Info
                                  </a>
                                </div>
                              </GridItem>
                            </GridContainer>
                          )
                        }
                      
                      {
                        (!existingFamily) && (
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                              <CustomInput
                                labelText="Family Name"
                                id="familyname"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: familyname,
                                  onChange: (e) => this.handleInputChange(e, 'familyname')
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                              <CustomInput
                                labelText="Family Email"
                                id="familyemail"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: familyemail,
                                  onChange: (e) => this.handleInputChange(e, 'familyemail')
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
                          </GridContainer>
                        )
                      }
                    </span>
                  )
                }
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Organization Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Member ID"
                      id="memberId"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: uid,
                        disabled: !hasSecureAccess || memberidautomate,
                        onChange: (e) => this.handleInputChange(e, 'uid')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      id="select-role"
                      className="select-input"
                      select
                      label="Membership Role"
                      value={role}
                      onChange={(e) => this.handleInputChange(e, 'role')}
                      margin="normal"
                      fullWidth
                      disabled={!hasAdminAccess}
                    >
                      {roles.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Membership Date"
                      id="member-date"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type:"date",
                        value: membershipdate,
                        disabled: !hasSecureAccess,
                        onChange: (e) => this.handleInputChange(e, 'membershipdate')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      id="select-type"
                      select
                      label="Active"
                      value={active}
                      onChange={(e) => this.handleInputChange(e, 'active')}
                      margin="normal"
                      fullWidth
                      className="select-input"
                      disabled={!hasSecureAccess}
                    >
                      {actives.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                {
                  this.props.hasOwnProperty('memberId') && this.props.memberId !== this.props.account.memberid ? (
                    <Button color="danger" className='add-button create' onClick={this.handleDelete}>
                      Delete
                    </Button>
                  ) : (
                    <span />
                  )
                }
                {
                  this.props.hasOwnProperty('memberId') && this.props.memberId !== this.props.account.memberid ? (
                    <span>
                      <Button className='add-button create' aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleActions}>
                        Actions
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={otherActionEl}
                        keepMounted
                        open={Boolean(otherActionEl)}
                        onClose={this.handleActionsClose}
                      >
                        <MenuItem onClick={this.sendWelcomeEmail}>Send Welcome Email</MenuItem>
                      </Menu>
                    </span>
                  ) : (
                    <span />
                  )
                }
                <Button color="info" className='add-button create'  type='submit'>
                  Save
                </Button>
              </CardFooter>
                {
                  this.props.hasOwnProperty('memberId') ? (
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <h6 className="form-subtitle">Groups</h6>
                          <Table
                            tableHeaderColor="primary"
                            tableData={
                              groups.map(
                                (group, index) => {
                                  return (
                                    [
                                      group.id,
                                      group.groupname
                                    ]
                                  )
                                }
                              )
                            }
                            rowActions={
                              hasAccess ?[
                                {
                                  type: 'delete',
                                  action: this.deleteGroupFromMember,
                                  label: 'Remove'
                                }
                              ] : []
                          }
                          />
                        </GridItem>
                        {
                          hasAccess && (
                            <GridItem xs={12} sm={12} md={6}>
                              <h6 className="form-subtitle">Add Group</h6>
                                <TextField
                                  id="select-group"
                                  className="select-input"
                                  select
                                  label="Select Group"
                                  value={group}
                                  onChange={(e) => this.handleInputChange(e, 'group')}
                                  margin="normal"
                                  fullWidth
                                >
                                  {allGroupsModified.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.groupname}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <Button className="form-button" color="info" size="sm" onClick={this.handleAddMemberToGroup}>Add</Button>
                            </GridItem>
                          )
                        }
                        
                      </GridContainer>
                  </CardBody>
                  ) : (
                    <span />
                  )
                }
            </Card>
          </GridItem>
        </GridContainer>
        <FamilyView
          open={this.state.openFamily > 0}
          onClose={this.handleCloseFamily}
          familyId={this.state.openFamily}
        />
        <AlertDialog
            open={this.state.deleteAction}
            onClose={this.closeDelete}
            onDecline={this.closeDelete}
            onAccept={this.deleteAction}
            acceptLabel={'Accept'}
            declineLabel={'Decline'}
            dialogTitle={'Deleting Member: ' + firstname + ' ' + lastname}
            dialogContent={'Are you sure you want to delete this member? This action is not reversible.'}
          />
      </form>
    );
  }
}

CreateMember.propTypes = {
  memberId: PropTypes.number,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

export default connect(
  ({ account }) => ({ account }),
  null
)( CreateMember );
