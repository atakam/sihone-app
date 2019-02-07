import React from "react";
import axios from "axios";
// @material-ui/core components
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
import Table from "components/Table/Table.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import './Settings.css';

class Membership extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      grouptype: '',
      grouptypes: [],
      notificationGroupType: false,
      notificationGroupTypeError: false,

      memberidautomate: false,
      memberidprefix: '',
      memberidlength: '',
      memberdefaultpassword: ''
    }
  }

  componentDidMount() {
    this.fetchGroupTypes();
    this.fetchSettings();
  }

  handleSaveGroupType = (event) => {
    event.preventDefault();
    const {
      grouptype
    } = this.state

    const grouptypeObj = {
      grouptype
    }

    axios({
      method: 'post',
      url: '/grouptype/new',
      data: grouptypeObj
    })
    .then(function(response, body) {
      this.setState({
        grouptype: ''
      });
      this.fetchGroupTypes();
    });
  }

  saveMemberSettings = (event) => {
    event.preventDefault();
    const {
      memberidautomate,
      memberidprefix,
      memberidlength,
      memberdefaultpassword
    } = this.state

    const settings = {
      memberidautomate: memberidautomate ? 1 : 0,
      memberidprefix,
      memberidlength,
      memberdefaultpassword
    }

    axios({
      method: 'post',
      url: '/settings/member/update',
      data: settings
    })
    .then(function(response, body) {
      this.props.openNotification && this.props.openNotification();
      this.fetchSettings();
    });
  }

  fetchGroupTypes = () => {
    fetch('/grouptype/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        grouptypes: json.grouptypes
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        memberidautomate: json.settings.memberidautomate === 1,
        memberidprefix: json.settings.memberidprefix,
        memberidlength: json.settings.memberidlength,
        memberdefaultpassword: json.settings.memberdefaultpassword
      })
    })
    .catch(error => console.log('error', error));
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleCheckboxChange = (event, checked, state) => {
    this.setState({ [state]: checked });
  }

  closeNotification = () => {
    this.setState({
      notificationGroupTypeError: false,
      grouptype: ''
    });
    this.fetchGroupTypes();
  }

  deleteGroupType = (grouptypeid) => {
    axios({
      method: 'post',
      url: '/grouptype/delete',
      data: { grouptypeid }
    })
    .then(function(response, body) {
      this.fetchGroupTypes();
    });
  }

  render () {
    const {
      grouptypes,
      grouptype,
      notificationGroupTypeError,

      memberidautomate,
      memberidprefix,
      memberidlength,
      memberdefaultpassword
    } = this.state;
    return (
      <div>
        <GridContainer>
          <Snackbar
            message={
              'ERROR - Cannot Delete!'
            }
            close
            place="tc"
            color="danger"
            open={notificationGroupTypeError}
            closeNotification={this.closeNotification}
          />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <p>Configure member id, predefined member options, family roles and group types.</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Membership Settings</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={memberidautomate}
                          onChange={(e, checked) => this.handleCheckboxChange(e, checked, 'memberidautomate')}
                        />
                      }
                      label="Automatic ID"
                      className="form-checkbox"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Member Id Prefix"
                      id="id-prefix"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: memberidprefix,
                        onChange: (e) => this.handleInputChange(e, 'memberidprefix')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Member Id Length"
                      id="id-length"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: memberidlength,
                        onChange: (e) => this.handleInputChange(e, 'memberidlength')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Default Passsword"
                      id="default-password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: memberdefaultpassword,
                        onChange: (e) => this.handleInputChange(e, 'memberdefaultpassword')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Button className="form-button" color="info" size="sm" onClick={this.saveMemberSettings}>Save</Button>
                  </GridItem>
                </GridContainer>
                <form  onSubmit={this.handleSaveGroupType}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <h6 className="form-subtitle">Group Settings</h6>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Add Group Type"
                        id="group-type"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: grouptype,
                          onChange: (e) => this.handleInputChange(e, 'grouptype')
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                      <Button className="form-button" color="info" size="sm" type="submit" disabled={grouptype === ''}>Add</Button>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <Table
                        tableHeaderColor="warning"
                        tableHead={["Group Types"]}
                        tableData={
                          grouptypes.map(
                            (grouptype, index) => {
                              return (
                                [
                                  grouptype.id,
                                  grouptype.grouptype
                                ]
                              )
                            }
                          )
                        }
                        rowActions={[
                          {
                            type: 'delete',
                            action: this.deleteGroupType,
                            label: 'Remove'
                          }
                        ]}
                      />
                    </GridItem>
                  </GridContainer>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default Membership;
