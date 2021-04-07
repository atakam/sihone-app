import React from "react";

import axios from "axios";
// @material-ui/core components
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

import Utils from "../utils/Utils";

class AccountReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      transactiontype: '',
      transactiondatefrom: '',
      transactiondateto: '',
      amountfrom: '',
      amountto: '',

      descriptionCheck: false,
      transactiontypeCheck: false,
      transactiondateCheck: false,
      amountCheck: false,

      notificationOpen: false,
      notificationErrorOpen: false,
      checkAll: false
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
      descriptionCheck: checked,
      transactiontypeCheck: checked,
      transactiondateCheck: checked,
      amountCheck: checked
    });
  }

  handleClear = () => {
    this.setState({
      description: '',
      transactiontype: '',
      transactiondatefrom: '',
      transactiondateto: '',
      amountfrom: '',
      amountto: '',

      descriptionCheck: false,
      transactiontypeCheck: false,
      transactiondateCheck: false,
      amountCheck: false,
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
      description,
      transactiontype,
      transactiondatefrom,
      transactiondateto,
      amountfrom,
      amountto,

      descriptionCheck,
      transactiontypeCheck,
      transactiondateCheck,
      amountCheck
    } = this.state;

    axios({
      method: 'post',
      url: '/report/account',
      data: {
        description,
        transactiontype,
        transactiondatefrom,
        transactiondateto,
        amountfrom,
        amountto,
  
        descriptionCheck,
        transactiontypeCheck,
        transactiondateCheck,
        amountCheck
      }
    })
    .then(function(response) {
      this.setState({
        notificationOpen: true
      });
      Utils.exportCSVFile(response.data.header, response.data.report, 'accounts');
    }.bind(this));
  }

  render () {

    const {
      description,
      transactiontype,
      transactiondatefrom,
      transactiondateto,
      amountfrom,
      amountto,

      descriptionCheck,
      transactiontypeCheck,
      transactiondateCheck,
      amountCheck,
      checkAll,

      notificationOpen,
      notificationErrorOpen
    } = this.state;

    const enabled = (
      descriptionCheck ||
      transactiontypeCheck ||
      transactiondateCheck ||
      amountCheck
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
                    <h6 className="form-subtitle">Transaction Information</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'descriptionCheck'); }}
                          checked={descriptionCheck}
                        />
                      }
                      label="Description"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: description,
                        onChange: (e) => this.handleInputChange(e, 'description')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'transactiontypeCheck'); }}
                          checked={transactiontypeCheck}
                        />
                      }
                      label="Transaction Type"
                      className="form-checkbox"
                    />
                    <CustomInput
                      labelText="Filter"
                      formControlProps={{
                        fullWidth: true,
                        className: 'flex-item'
                      }}
                      inputProps={{
                        value: transactiontype,
                        onChange: (e) => this.handleInputChange(e, 'transactiontype')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} classes={{grid: 'flex'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => { this.handleOnCheck(e, checked, 'transactiondateCheck'); }}
                          checked={transactiondateCheck}
                        />
                      }
                      label="Transaction Date"
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
                        value: transactiondatefrom,
                        onChange: (e) => this.handleInputChange(e, 'transactiondatefrom')
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
                        value: transactiondateto,
                        onChange: (e) => this.handleInputChange(e, 'transactiondateto')
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
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="danger" className='add-button create' onClick={this.handleClear}>
                  Clear
                </Button>
                <Button color="info" className='add-button create'  onClick={this.generateReport.bind(this)} disabled={!enabled}>
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

export default AccountReport;
