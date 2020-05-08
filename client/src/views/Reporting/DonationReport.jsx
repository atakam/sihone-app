import React from "react";
import axios from "axios";
// @material-ui/core components
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

class DonationReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      paydatefrom: '',
      paydateto: '',
      paytype: '',
      fundname: '',
      amountfrom: '',
      amountto: '',
      envelope: '',
      envelope_status: '',
      envelope_datefrom: '',
      envelope_dateto: '',
      account: '',

      firstNameCheck: false,
      lastNameCheck: false,
      paydateCheck: false,
      paytypeCheck: false,
      fundnameCheck: false,
      amountCheck: false,
      envelopeCheck: false,
      envelope_statusCheck: false,
      envelope_dateCheck: false,
      accountCheck: false,
      checkAll: false,

      notificationOpen: false,
      notificationErrorOpen: false
    };
  }

  componentDidMount () {
    this.checkAll(null, true);
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

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
      paydateCheck: checked,
      paytypeCheck: checked,
      fundnameCheck: checked,
      amountCheck: checked,
      envelopeCheck: checked,
      envelope_statusCheck: checked,
      envelope_dateCheck: checked,
      accountCheck: checked
    });
  }

  handleClear = () => {
    this.setState({
      firstname: '',
      lastname: '',
      paydatefrom: '',
      paydateto: '',
      paytype: '',
      fundname: '',
      amountfrom: '',
      amountto: '',
      envelope: '',
      envelope_status: '',
      envelope_datefrom: '',
      envelope_dateto: '',
      account: '',

      firstNameCheck: false,
      lastNameCheck: false,
      paydateCheck: false,
      paytypeCheck: false,
      fundnameCheck: false,
      amountCheck: false,
      envelopeCheck: false,
      envelope_statusCheck: false,
      envelope_dateCheck: false,
      accountCheck: false,
      checkAll: false
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
      firstname,
      lastname,
      paydatefrom,
      paydateto,
      paytype,
      fundname,
      amountfrom,
      amountto,
      envelope,
      envelope_status,
      envelope_datefrom,
      envelope_dateto,
      account,

      firstNameCheck,
      lastNameCheck,
      paydateCheck,
      paytypeCheck,
      fundnameCheck,
      amountCheck,
      envelopeCheck,
      envelope_statusCheck,
      envelope_dateCheck,
      accountCheck
    } = this.state;

    axios({
      method: 'post',
      url: '/report/donation',
      data: {
        firstname,
        lastname,
        paydatefrom,
        paydateto,
        paytype,
        fundname,
        amountfrom,
        amountto,
        envelope,
        envelope_status,
        envelope_datefrom,
        envelope_dateto,
        account,

        firstNameCheck,
        lastNameCheck,
        paydateCheck,
        paytypeCheck,
        fundnameCheck,
        amountCheck,
        envelopeCheck,
        envelope_statusCheck,
        envelope_dateCheck,
        accountCheck
      }
    })
    .then(function(response) {
      this.setState({
        notificationOpen: true
      });
      Utils.exportCSVFile(response.data.header, response.data.report, 'donations');
    }.bind(this));
  }

  render () {

    const {
      firstname,
      lastname,
      paydatefrom,
      paydateto,
      paytype,
      fundname,
      amountfrom,
      amountto,
      envelope,
      envelope_status,
      envelope_datefrom,
      envelope_dateto,
      account,

      firstNameCheck,
      lastNameCheck,
      paydateCheck,
      paytypeCheck,
      fundnameCheck,
      amountCheck,
      envelopeCheck,
      envelope_statusCheck,
      envelope_dateCheck,
      accountCheck,
      checkAll,

      notificationOpen,
      notificationErrorOpen
    } = this.state;

    const enabled = (
      firstNameCheck ||
      lastNameCheck ||
      paydateCheck ||
      paytypeCheck ||
      fundnameCheck ||
      amountCheck ||
      envelopeCheck ||
      envelope_statusCheck ||
      envelope_dateCheck ||
      accountCheck
    );

    return (
      <form>
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
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Donation Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'paytypeCheck'); }}
                          checked={paytypeCheck}
                        />
                      }
                      label="Pay Type"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"text",
                        value: paytype,
                        onChange: (e) => this.handleInputChange(e, 'paytype')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'paydateCheck'); }}
                          checked={paydateCheck}
                        />
                      }
                      label="Pay Date"
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
                        value: paydatefrom,
                        onChange: (e) => this.handleInputChange(e, 'paydatefrom')
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
                        value: paydateto,
                        onChange: (e) => this.handleInputChange(e, 'paydateto')
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
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'fundnameCheck'); }}
                          checked={fundnameCheck}
                        />
                      }
                      label="Fund Name"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      id="mobile"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: fundname,
                        onChange: (e) => this.handleInputChange(e, 'fundname')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'amountCheck'); }}
                          checked={amountCheck}
                        />
                      }
                      label="Amount"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter From"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: amountfrom,
                        type: 'number',
                        onChange: (e) => this.handleInputChange(e, 'amountfrom')
                      }}
                    />
                    <CustomInput
                      labelText="Filter To"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: amountto,
                        type: 'number',
                        onChange: (e) => this.handleInputChange(e, 'amountto')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'envelopeCheck'); }}
                          checked={envelopeCheck}
                        />
                      }
                      label="Envelope"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: envelope,
                        onChange: (e) => this.handleInputChange(e, 'envelope')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'envelope_statusCheck'); }}
                          checked={envelope_statusCheck}
                        />
                      }
                      label="Envelope Open"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="True or False"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: envelope_status,
                        onChange: (e) => this.handleInputChange(e, 'envelope_status')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'envelope_dateCheck'); }}
                          checked={envelope_dateCheck}
                        />
                      }
                      label="Envelope Date"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter From"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        type:"date",
                        value: envelope_datefrom,
                        onChange: (e) => this.handleInputChange(e, 'envelope_datefrom')
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
                        value: envelope_dateto,
                        onChange: (e) => this.handleInputChange(e, 'envelope_dateto')
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
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'accountCheck'); }}
                          checked={accountCheck}
                        />
                      }
                      label="Account"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: account,
                        onChange: (e) => this.handleInputChange(e, 'account')
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

export default DonationReport;
