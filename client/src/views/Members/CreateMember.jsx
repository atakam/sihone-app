import React from "react";
import PropTypes from "prop-types";

import request from "request";
// @material-ui/core components
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// core components
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

import FamilyView from './FamilyView'

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

      notificationDeleteErrorOpen: false
    };
  }

  componentDidMount () {
    this.fetchFamilies();
    this.props.memberId && this.fetchMember();
    this.props.memberId && this.fetchGroupsByMember();
    this.props.memberId && this.fetchGroups();
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

  fetchGroups = () => {
    fetch('/group/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        allGroups: json.groups
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

        firstname: json.member.firstname,
        lastname: json.member.lastname,
        birthdate: json.member.birthdate ? json.member.birthdate.split('T')[0] : '',
        email: json.member.email,
        phone: json.member.phone,
        uid: json.member.memberuid,
        membershipdate: json.member.membershipdate ? json.member.membershipdate.split('T')[0] : '',
        familyid: json.member.familyid
      })
    })
    .catch(error => console.log('error', error));
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

  handleSave = (event) => {
    event.preventDefault();
    const {
      gender,
      marital,
      role,
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
      memberid: this.props.memberId,
      gender,
      marital,
      memberrole: role,
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
      homephone
    }

    var options = {
      method: 'POST',
      url: '/member/update',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: member
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationOpen: true
      });
      console.log(body);
    }.bind(this));
  }

  handleSaveNew = (event) => {
    event.preventDefault();
    const {
      gender,
      marital,
      role,
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

    var options = {
      method: 'POST',
      url: '/member/new',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: member
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationNewOpen: true
      });
      this.reset();
      //this.props.onSave && this.props.onSave();
      console.log(body);
    }.bind(this));
  }

  reset = () => {
    !this.props.memberId && this.setState({
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
      notificationNewOpen: false,
      notificationRemoveOpen: false,
      notificationDeleteErrorOpen: false
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

    var options = {
      method: 'POST',
      url: '/member/delete',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: group
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationDeleteErrorOpen: response.statusCode !== 200,
        deleteAction: false
      });
      response.statusCode === 200 && this.props.onClose();
      console.log(body);
    }.bind(this));
  }

  deleteGroupFromMember = (groupid) => {
    const membergroup = {
      groupid,
      memberid: this.props.memberId,
    }

    var options = {
      method: 'POST',
      url: '/group/removeGroup',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: membergroup
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationRemoveOpen: true,
        deleteAction: false,
        member: ''
      });
      this.fetchGroupsByMember();
      console.log(body);
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

    var options = {
      method: 'POST',
      url: '/group/addMember',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: membergroup
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationAddOpen: true,
        member: ''
      });
      this.fetchGroupsByMember();
      console.log(body);
    }.bind(this));
  }

  render () {
    const genderlist = [
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

      groups,
      allGroups,
      group
    } = this.state

    const excludes = groups.map((group) => group.id);

    let allGroupsModified = allGroups.map(group => {
      if (excludes.indexOf(group.id) < 0) {
        return group
      }
      return null;
    });

    allGroupsModified = allGroupsModified.filter((obj) => obj );

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
                  <CardHeader color="info">
                    <h4>New Member Creation</h4>
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
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'password',
                        value: password,
                        autoComplete: 'new-password',
                        onChange: (e) => this.handleInputChange(e, 'password')
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Family Information</h6>
                  </GridItem>
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
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Organization Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Member ID"
                      id="memberId"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: uid,
                        onChange: (e) => this.handleInputChange(e, 'uid')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="select-role"
                      className="select-input"
                      select
                      label="Membership Role"
                      value={role}
                      onChange={(e) => this.handleInputChange(e, 'role')}
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
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Membership Date"
                      id="member-date"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type:"date",
                        value: membershipdate,
                        onChange: (e) => this.handleInputChange(e, 'membershipdate')
                      }}
                      labelProps={{
                        shrink: true,
                      }}
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
                            rowActions={[
                              {
                                type: 'delete',
                                action: this.deleteGroupFromMember,
                                label: 'Remove'
                              }
                            ]}
                          />
                        </GridItem>
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

export default CreateMember;
