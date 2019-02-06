import React from "react";

import request from "request";
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
    var options = {
      method: 'POST',
      url: '/paymenttype/delete',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: { paymenttypeid }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.fetchPaymentTypes();

      if (JSON.parse(body).error){
        this.setState({
          notificationDeleteError: true
        });
      }
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

    var options = {
      method: 'POST',
      url: '/paymenttype/new',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: paymenttypeObj
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.fetchPaymentTypes();
      this.setState({
        paymenttype: ''
      });
      console.log(body);
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
    var options = {
      method: 'POST',
      url: '/fund/delete',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: { fundid }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.fetchFunds();

      if (JSON.parse(body).error){
        this.setState({
          notificationDeleteError: true
        });
      }
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

    var options = {
      method: 'POST',
      url: '/fund/new',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: fundObj
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.fetchFunds();
      this.setState({
        paymenttype: '',
        fund: ''
      });
      console.log(body);
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
      paymenttype: '',
      fund: ''
    });
    this.fetchPaymentTypes();
    this.fetchFunds();
  }

  render () {
    const {
      notificationDeleteError,
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
              'ERROR - Cannot Delete!'
            }
            close
            place="tc"
            color="danger"
            open={notificationDeleteError}
            closeNotification={this.closeNotification}
          />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <p>Configure payment types, payment types, account categories and funds.</p>
              </CardHeader>
              <CardBody>
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
