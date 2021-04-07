import React from "react";
import PropTypes from "prop-types";

import axios from "axios";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Table from "components/Table/Table.jsx";

import MemberView from './MemberView.jsx'

class EditFamily extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      familyname: '',
      familyemail: '',
      streetaddress: '',
      city: '',
      province: '',
      postalcode: '',
      country: '',
      homephone: '',
      notificationOpen: false,
      members: [],
      openMember: 0
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  componentDidMount () {
    this.props.familyId && this.fetchFamily();
    this.props.familyId && this.fetchMembersByFamily();
  }

  fetchFamily = () => {
    fetch('/family/find/' + this.props.familyId,)
    .then(response => response.json())
    .then(json => {
      console.log('family', json.family);
      this.setState({
        familyname: json.family.familyname ? json.family.familyname : '',
        familyemail: json.family.email ? json.family.email : '',
        streetaddress: json.family.streetaddress ? json.family.streetaddress : '',
        city: json.family.city ? json.family.city : '',
        province: json.family.province ? json.family.province : '',
        postalcode: json.family.postalcode ? json.family.postalcode : '',
        country: json.family.country ? json.family.country : '',
        homephone: json.family.phone ? json.family.phone : ''
      });
    })
    .catch(error => console.log('error', error));
  }

  fetchMembersByFamily = () => {
    fetch('/member/findAll/' + this.props.familyId)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        members: json.members
      })
    })
    .catch(error => console.log('error', error));
  }

  handleSave = (event) => {
    event.preventDefault();
    const {
      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone
    } = this.state

    const family = {
      familyid: this.props.familyId,
      familyname,
      email: familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      phone: homephone
    }

    axios({
      method: 'post',
      url: '/family/update',
      data: family
    })
    .then(function(response, body) {
      this.setState({
        notificationOpen: true
      });
      this.props.familyId && this.fetchFamily();
      this.props.familyId && this.fetchMembersByFamily();
    }.bind(this));
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false
    });
  }

  onEdit = (id) => {
    this.setState({ openMember: id });
  }

  handleCloseMember = () => {
    this.setState({ openMember: 0 });
    this.fetchMembersByFamily();
  }

  render () {
    const {
      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone,
      notificationOpen
    } = this.state

    let memberlist = this.state.members.filter(function (el) {
      return !!el.active;
    });

    return (
      <form onSubmit={this.handleSave}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <GridContainer>
                <Snackbar
                  message={
                    'SUCCESS - Update Successful'
                  }
                  close
                  place="tc"
                  color="success"
                  open={notificationOpen}
                  closeNotification={this.closeNotification}
                />
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Family Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Family Name"
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: familyname,
                        onChange: (e) => this.handleInputChange(e, 'familyname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
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
                </GridContainer>
                <GridContainer>
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
                </GridContainer>
              </CardBody>
              <CardFooter>
                <span />
                <Button color="info" className='add-button create' type='submit'>
                  Save
                </Button>
              </CardFooter>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Family Members</h6>
                  </GridItem>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["Name", "Family Roles", "Email", "Phone"]}
                    tableData={
                      memberlist.map(
                        (member, index) => {
                          return (
                            [
                              member.id,
                              member.firstname + " " + member.lastname,
                              member.familyrole,
                              member.email,
                              member.phone
                            ]
                          )
                        }
                      )
                    }
                    onRowClick={this.onEdit}
                  />
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <MemberView
            open={this.state.openMember > 0}
            onClose={this.handleCloseMember}
            memberId={this.state.openMember}
          />
        </GridContainer>
      </form>
    );
  }
}

EditFamily.propTypes = {
  familyId: PropTypes.number
};

export default EditFamily;
