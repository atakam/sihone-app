import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
// import CsvParse from '@vtex/react-csv-parse';
// @material-ui/core components
import FormControlLabel from '@material-ui/core/FormControlLabel';
// core components
import Checkbox from "components/CustomInput/CustomCheckbox.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

class CreateMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      enforcefamily: true,

      notificationOpen: false,
      notificationError: false,
      notificationErrorMessage: ''
    };
  }

  enforceFamily = (e, checked) => {
    this.setState({
      enforcefamily: checked
    });
  }

  handleData = data => {
    this.setState({ data })
  }

  handleImport = (event) => {
    event.preventDefault();
    const {
      data,
      enforcefamily
    } = this.state

    const importObj = {
      data,
      enforcefamily
    }

    axios({
      method: 'post',
      url: '/member/import',
      data: importObj
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
        this.form.reset();
      }
      
    }.bind(this));
    this.props.refreshNumbers && this.props.refreshNumbers();
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
      notificationError: false,
      notificationErrorMessage: ''
    });
  }

  

  render () {
    const {
      enforcefamily,
      notificationOpen,
      notificationError,
      notificationErrorMessage
    } = this.state

    const keys = [
      'firstname',
      'lastname',
      'gender',
      'birthdate',
      'marital',
      'email',
      'phone',
      'familyname',
      'familyemail',
      'homephone',
      'streetaddress',
      'city',
      'province',
      'postalcode',
      'country',
      'memberid',
      'memberrole',
      'membershipdate',
      'subscribtion'
    ];

    return (
      <form onSubmit={this.handleImport} ref={node => this.form = node}>
        <GridContainer>
          <Snackbar
            message={
              'SUCCESS - Import Successful!'
            }
            close
            place="tc"
            color="success"
            open={notificationOpen}
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
                  <GridItem xs={12} sm={12} md={6}>
                    <h6 className="form-subtitle">Import Format</h6>
                    <br />
                    The import file must <b>ONLY</b> be of type .csv (Comma-separated values) file. 
                    <a href="/template.xlsx" download> Download Import File Template</a>
                    <br /><br />
                    Your spreadsheet must follow the following format in this particular order to get a smooth import of your members:<br /><br />
                    <b>NB: All fields are mandatory, even if there are empty.</b>
                    <ul>
                        <li>First Name</li>
                        <li>Last Name</li>
                        <li>Gender</li>
                        <li>Date of Birth</li>
                        <li>Marital Status</li>
                        <li>Email</li>
                        <li>Mobile Phone Number</li>
                        <li>Family Name (If different from last name)</li>
                        <li>Family Email</li>
                        <li>Home Phone Number</li>
                        <li>Street Address</li>
                        <li>City</li>
                        <li>Province</li>
                        <li>Postal Code</li>
                        <li>Country</li>
                        <li>Member Id</li>
                        <li>Membership Role</li>
                        <li>Membership Date</li>
                        <li>Email Subscription</li>
                    </ul>
                  </GridItem>
                  
                  {/* <GridItem xs={12} sm={12} md={6}>
                    <h6 className="form-subtitle">Import</h6>
                    <CsvParse
                      keys={keys}
                      onDataUploaded={this.handleData}
                      onError={this.handleError}
                      render={onChange => <input type="file" onChange={onChange} accept=".csv" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={this.enforceFamily}
                          checked={enforcefamily}
                        />
                      }
                      label="Enforce members with the EXACT same address to be put in the same family."
                      className="form-checkbox"
                    />
                    <br />
                    <Button color="info" className='add-button create'  type='submit' disabled={this.state.data === null}>
                      Import
                    </Button>
                  </GridItem> */}
                </GridContainer>
              </CardBody>
              <CardFooter>
                
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
