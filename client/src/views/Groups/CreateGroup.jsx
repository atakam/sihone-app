import React from "react";
import PropTypes from "prop-types";
import CONFIG from "../../configs";
import request from "request";
// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import AlertDialog from "components/Dialog/AlertDialog";
import Table from "components/Table/Table.jsx";

import MemberView from '../Members/MemberView.jsx'

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import MemberSelect from '../utils/MemberSelect.jsx'

class CreateGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grouptypeid: '',
      groupname: '',
      grouptypes: [],

      notificationOpen: false,
      notificationNewOpen: false,

      deleteAction: false,

      openMember: 0,
      members: [],
      member: '',
      notificationAddOpen: false,
      notificationRemoveOpen: false,
      notificationDeleteErrorOpen: false
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target ? event.target.value : event.value });
  }

  handleTypeChange = (event) => {
    this.setState({
      type: event.target.value
    });
  };

  handleMemberChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  fetchGroup = () => {
    fetch(CONFIG.serverUrl+'/group/find/' + this.props.groupId,)
    .then(response => response.json())
    .then(json => {
      console.log('group', json.group);
      this.setState({
        groupname: json.group.groupname,
        grouptypeid: json.group.grouptypeid ? json.group.grouptypeid : ''
      })
    })
    .catch(error => console.log('error', error));
  }

  handleSave = (event) => {
    event.preventDefault();
    const {
      groupname,
      grouptypeid
    } = this.state

    const group = {
      groupid: this.props.groupId,
      groupname,
      grouptypeid
    }

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/group/update',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: group
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
      groupname,
      grouptypeid
    } = this.state

    const group = {
      groupname,
      grouptypeid
    }

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/group/new',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: group
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationNewOpen: true
      });
      this.reset();
      console.log(body);
    }.bind(this));
  }

  fetchGroupTypes = () => {
    fetch(CONFIG.serverUrl+'/grouptype/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        grouptypes: json.grouptypes
      })
      !this.props.groupId && this.setState({
        grouptypeid: json.grouptypes.length > 0 ? json.grouptypes[0].id : ''
      })
    })
    .catch(error => console.log('error', error));
  }

  componentDidMount() {
    this.fetchGroupTypes();
    this.props.groupId && this.fetchGroup();
    this.props.groupId && this.fetchMembersByGroup();
  }

  reset = () => {
    !this.props.groupId && this.setState({
      grouptypeid: '',
      groupname: ''
    });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
      notificationNewOpen: false,
      notificationAddOpen: false,
      notificationRemoveOpen: false,
      notificationDeleteErrorOpen: false
    });
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
      groupid: this.props.groupId
    }

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/group/delete',
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
      console.log(response);
    }.bind(this));
  }

  onEdit = (id) => {
    this.setState({ openMember: id });
  }

  fetchMembersByGroup = () => {
    fetch(CONFIG.serverUrl+'/member/findAll/g/' + this.props.groupId)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        members: json.members
      })
    })
    .catch(error => console.log('error', error));
  }

  handleCloseMember = () => {
    this.setState({ openMember: 0 });
    this.fetchMembersByGroup();
  }

  handleAddMemberToGroup = () => {
    const membergroup = {
      groupid: this.props.groupId,
      memberid: this.state.member.value
    }

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/group/addMember',
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
      this.fetchMembersByGroup();
      console.log(body);
    }.bind(this));
  }

  deleteMemberFromGroup = (memberid) => {
    const membergroup = {
      groupid: this.props.groupId,
      memberid
    }

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/group/removeMember',
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
      this.fetchMembersByGroup();
      console.log(body);
    }.bind(this));
  }

  render () {
    const {
      groupname,
      grouptypeid,
      notificationOpen,
      notificationNewOpen,
      notificationAddOpen,
      notificationRemoveOpen,
      notificationDeleteErrorOpen,
      grouptypes,
      member,
      members
    } = this.state;

    const actions = [
      {
        type: 'delete',
        action: this.deleteMemberFromGroup,
        label: 'Remove'
      }
    ]

    return (
      <div>
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
              'SUCCESS - New Group Created!'
            }
            close
            place="tc"
            color="success"
            open={notificationNewOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'SUCCESS - Member successfully added!'
            }
            close
            place="tc"
            color="success"
            open={notificationAddOpen}
            closeNotification={this.closeNotification}
          />
          <Snackbar
            message={
              'SUCCESS - Member successfully removed!'
            }
            close
            place="tc"
            color="success"
            open={notificationRemoveOpen}
            closeNotification={this.closeNotification}
          />

          <Snackbar
            message={
              'ERROR - Cannot delete Group. Remove all members from the group first!'
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
                this.props.hasOwnProperty('groupId') ? (
                  null
                ) : (
                  <CardHeader color="info">
                    <h4>Fill in the form below to create a Group</h4>
                  </CardHeader>
                )
              }
              <form onSubmit={this.props.hasOwnProperty('groupId') ? this.handleSave : this.handleSaveNew}>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Group Name"
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        autoFocus:this.props.hasOwnProperty('groupId') ? false : true,
                        value: groupname,
                        onChange: (e) => this.handleInputChange(e, 'groupname'),
                        required: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      id="select-type"
                      select
                      label="Group Type"
                      value={grouptypeid}
                      onChange={(e) => this.handleInputChange(e, 'grouptypeid')}
                      margin="normal"
                      fullWidth
                      className="select-input"
                      required
                    >
                      {grouptypes.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.grouptype}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                {
                  this.props.hasOwnProperty('groupId') ? (
                    <Button color="danger" className='add-button create' onClick={this.handleDelete}>
                      Delete
                    </Button>
                  ) : (
                    <span />
                  )
                }
                <Button color="info" className='add-button create' type='submit'>
                  Save
                </Button>
              </CardFooter>
              </form>
              {
                  this.props.groupId ? (
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <h6 className="form-subtitle">Group Members</h6>
                        </GridItem>
                        
                        <GridItem xs={12} sm={12} md={10}>
                          <MemberSelect
                            placeholder="Member Search"
                            value={member}
                            onChange={this.handleMemberChange('member')}
                            excludeMembers={members}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={2}>
                          <Button className="form-button" color="info" size="sm" onClick={this.handleAddMemberToGroup}>Add</Button>
                        </GridItem>
                        <Table
                          tableHeaderColor="primary"
                          tableHead={["Name", "Email", "Phone"]}
                          tableData={
                            this.state.members.map(
                              (member, index) => {
                                return (
                                  [
                                    member.id,
                                    member.firstname + " " + member.lastname,
                                    member.email,
                                    member.phone
                                  ]
                                )
                              }
                            )
                          }
                          onRowClick={this.onEdit}
                          rowActions={actions}
                        />
                      </GridContainer>
                  </CardBody>
                  ) : (
                    null
                  )
              }
            </Card>
          </GridItem>
          <AlertDialog
            open={this.state.deleteAction}
            onClose={this.closeDelete}
            onDecline={this.closeDelete}
            onAccept={this.deleteAction}
            acceptLabel={'Accept'}
            declineLabel={'Decline'}
            dialogTitle={'Deleting Group: ' + groupname}
            dialogContent={'Are you sure you want to delete this group? This action is not reversible.'}
          />
          <MemberView
            open={this.state.openMember > 0}
            onClose={this.handleCloseMember}
            memberId={this.state.openMember}
          />
        </GridContainer>
      </div>
    )
  }
}

CreateGroup.propTypes = {
  groupId: PropTypes.number,
  onClose: PropTypes.func
};

export default CreateGroup;
