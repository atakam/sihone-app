import React from "react";
import axios from "axios";
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

class Finance extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      paymenttype: '',
      paymentTypes: [],
      notificationMessage: null,

      fund: '',
      funds: []
    };
  }

  fetchPaymentTypes = () => {
    fetch('/paymenttype/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        paymentTypes: json.paymenttypes
      })
    })
    .catch(error => console.log('error', error));
  }

  deletePaymentType = (paymenttypeid) => {
    axios({
      method: 'post',
      url: '/paymenttype/delete',
      data: { paymenttypeid }
    })
    .then(function(response) {
      if (response.data && response.data.error) {
        this.setState({
          notificationDeleteError: true,
          notificationMessage: response.data.message
        });
      }
      else if (response.status === 200)
        this.fetchPaymentTypes();
      
    }.bind(this));
  }

  handleSavePaymentType = (event) => {
    event.preventDefault();
    const {
      paymenttype
    } = this.state

    const paymenttypeObj = {
      paymenttype
    }
    
    axios({
      method: 'post',
      url: '/paymenttype/new',
      data: paymenttypeObj
    })
    .then(function(response) {
      if (response.status === 200) {
        this.fetchPaymentTypes();
        this.setState({
          paymenttype: ''
        });
      }
    }.bind(this));
  }

  fetchFunds = () => {
    fetch('/fund/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        funds: json.funds
      })
    })
    .catch(error => console.log('error', error));
  }

  deleteFund = (fundid) => {
    axios({
      method: 'post',
      url: '/fund/delete',
      data: { fundid }
    })
    .then(function(response) {
      if (response.data && response.data.error) {
        this.setState({
          notificationDeleteError: true,
          notificationMessage: response.data.message
        });
      }
      else if (response.status === 200)
        this.fetchFunds();
      
    }.bind(this));
  }

  handleSaveFund = (event) => {
    event.preventDefault();
    const {
      fund
    } = this.state

    const fundObj = {
      fundname: fund
    }

    axios({
      method: 'post',
      url: '/fund/new',
      data: fundObj
    })
    .then(function(response) {
      if (response.status === 200) {
        this.fetchFunds();
        this.setState({
          paymenttype: '',
          fund: ''
        });
      }
    }.bind(this));
  }

  componentDidMount() {
    this.fetchPaymentTypes();
    this.fetchFunds();
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  closeNotification = () => {
    this.setState({
      notificationDeleteError: false,
      notificationMessage: null
    });
    this.fetchPaymentTypes();
    this.fetchFunds();
  }

  render () {
    const {
      notificationDeleteError,
      notificationMessage,
      paymenttype,
      paymentTypes,
      fund,
      funds
    } = this.state

    return (
      <div>
        <GridContainer>
          <Snackbar
            message={
              notificationMessage || 'ERROR - Cannot Delete!'
            }
            close
            place="tc"
            color="danger"
            open={notificationDeleteError}
            closeNotification={this.closeNotification}
          />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                {this.props.tabs}
                <p>Configure payment types, payment types, account categories and funds.</p>
              </CardHeader>
              <CardBody>
              <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Donation Receipt Authorized Signature</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <br />
                    <i>Contact us to place your 'Donation Receipt Authorized Signature' directly on every generated receipt.</i>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Payment Configuration</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Add Payment Type"
                      id="payment-type"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: paymenttype,
                        onChange: (e) => this.handleInputChange(e, 'paymenttype')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <Button className="form-button" color="info" size="sm" onClick={this.handleSavePaymentType} disabled={paymenttype === ''}>Add</Button>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Table
                      tableHeaderColor="warning"
                      tableHead={["Payment Type"]}
                      tableData={
                        paymentTypes.map(
                          (paymenttype, index) => {
                            return (
                              [
                                paymenttype.id,
                                paymenttype.paymenttype
                              ]
                            )
                          }
                        )
                      }
                      rowActions={[
                        {
                          type: 'delete',
                          action: this.deletePaymentType,
                          label: 'Remove'
                        }
                      ]}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h6 className="form-subtitle">Funds Configuration</h6>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Add Fund"
                      id="fund"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: fund,
                        onChange: (e) => this.handleInputChange(e, 'fund')
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <Button className="form-button" color="info" size="sm"  onClick={this.handleSaveFund} disabled={fund === ''}>Add</Button>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Table
                      tableHeaderColor="warning"
                      tableHead={["Funds", ""]}
                      tableData={
                        funds.map(
                          (fund, index) => {
                            return (
                              [
                                fund.id,
                                fund.fundname
                              ]
                            )
                          }
                        )
                      }
                      rowActions={[
                        {
                          type: 'delete',
                          action: this.deleteFund,
                          label: 'Remove'
                        }
                      ]}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default Finance;
