import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from "components/CustomButtons/Button.jsx";
import AlertDialog from "components/Dialog/AlertDialog";

import MemberSelect from '../utils/MemberSelect.jsx';

import Utils from "../utils/Utils";

class DonationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      donations: [],

      member: '',
      paytype: '',
      paydate: Utils.getDateString(new Date(), false),
      checknumber: '',
      fundValues: [],
      donationid: '',

      paytypes: [],
      funds: [],

      deleteAction: false,
      transactionToDelete: 0,

      showForm: false
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleMemberChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  handleFundChange = (event, i) => {
    let fundValues = this.state.fundValues;
    fundValues.map((fund) => {
      if (fund.fundid === i) {
        fund.amount = event.target.value;
      }
      return null;
    });
    this.setState({ fundValues });
  }

  componentDidMount () {
    this.props.envelopeId && this.fetchDonations();
    this.fetchPaymentTypes();
    this.fetchFunds();
  }

  fetchDonations = () => {
    fetch('/donation/findAll/'+this.props.envelopeId)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        donations: json.donations
      }, this.props.setDonationNumber(json.donations.length))
    })
    .catch(error => console.log('error', error));
  }

  fetchPaymentTypes = () => {
    fetch('/paymenttype/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        paytypes: json.paymenttypes
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchFunds = () => {
    fetch('/fund/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      
      let fundValues = json.funds.map((fund) =>{
        return {
          fundid: fund.id,
          amount: 0
        }
      });

      this.setState({
        funds: json.funds,
        fundValues
      })
    })
    .catch(error => console.log('error', error));
  }

  donationForm = () => {
    const {
      member,
      paytype,
      paydate,
      fundValues,
      checknumber,
      donationid,

      funds,
      paytypes
    } = this.state
    return (
      <div className="clear">
        <h6 className="form-subtitle transaction-form">
          {
            donationid === '' ? (
              'New Donation'
            ) : (
              'Edit Donation'
            )
          }
        </h6>
        <GridContainer>
          <GridItem xs={12} sm={6} md={12}>
            <MemberSelect
              placeholder="Member Search"
              value={member}
              onChange={this.handleMemberChange('member')}
              required
              showId
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <TextField
              id="select-type"
              select
              label="Payment Type"
              value={paytype}
              onChange={(e) => this.handleInputChange(e, 'paytype')}
              margin="normal"
              fullWidth
              className="select-input"
            >
              {paytypes.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.paymenttype}
                </MenuItem>
              ))}
            </TextField>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <CustomInput
              labelText={'Date'}
              id="date"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type:"date",
                value: paydate,
                onChange: (e) => this.handleInputChange(e, 'paydate')
              }}
              labelProps={{
                shrink: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={12}>
            <CustomInput
              labelText={'Notes'}
              id="checknumber"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: checknumber,
                onChange: (e) => this.handleInputChange(e, 'checknumber')
              }}
            />
          </GridItem>
          {
            funds.map((fund, i) => {
              return (
                <GridItem key={i} xs={12} sm={6} md={6}>
                  <CustomInput
                    labelText={fund.fundname}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      startAdornment:<InputAdornment position="start">$</InputAdornment>,
                      value: fundValues.length > 0 ? fundValues[i].amount : '',
                      onChange: (e) => this.handleFundChange(e, fund.id),
                      type: 'number'
                    }}
                  />
                </GridItem>
              );
            })
          }
        </GridContainer>
      </div>
    );
  }

  editDonation = (donationid) => {
    this.state.donations.map((donation) => {
      if (donation.id === donationid) {
        let fundValues = this.state.fundValues;
        fundValues.map((fund) => {
          if (fund.fundid === donation.fundid) {
            fund.amount = donation.amount;
          }
          return null;
        });
        this.setState({
          descriptiontext: donation.descriptiontext ? donation.descriptiontext : '',
          type: donation.donationtype ? donation.donationtype : '',
          donationdate: donation.donationdate ? donation.donationdate.split('T')[0] : '',
          amount: donation.amount ? donation.amount : '',
          receipt: donation.receipt ? donation.receipt : '',
          donationid: donation.id ? donation.id : '',

          member: { value: donation.memberid, label: donation.firstname + ' ' + donation.lastname },
          paytype: donation.paytype ? Number(donation.paytype) : '',
          paydate: donation.paydate ? donation.paydate.split('T')[0] : '',
          checknumber: donation.checknumber ? donation.checknumber : '',
          fundValues,

          showForm: true
        });
      }
      return null;
    });
  }

  newDonation = () => {
    this.setState({
      member: '',
      paytype: '',
      paydate: this.props.envelopeDate || Utils.getDateString(new Date(), false),
      checknumber: '',
      fundValues: [],
      donationid: '',
      showForm: true
    });
    this.fetchFunds();
  };

  saveDonation = (event) => {
    event.preventDefault();
    const {
      member,
      paytype,
      paydate,
      checknumber,
      fundValues,
      donationid
    } = this.state

    let _fundValues = fundValues.map((fv) => {
      return {
        fundid: fv.fundid,
        amount: Number(fv.amount)
      }
    });

    let donation = {
      memberid: member.value,
      paytype,
      paydate: paydate.split('T')[0],
      checknumber,
      donationfunds: JSON.stringify(_fundValues),
      donationid
    }
    let api = '/donation/update';
    let refresh = false;
    if (donationid === '') {
      donation = {
        envelopeid: this.props.envelopeId,
        memberid: member.value,
        paytype,
        paydate: paydate.split('T')[0],
        checknumber,
        donationfunds: JSON.stringify(_fundValues),
        donationid
      };
      api = '/donation/new';
      refresh = true;
    }

    console.log("Donation", donation);

    axios({
      method: 'post',
      url: api,
      data: donation
    })
    .then(function(response, body) {
      this.props.envelopeId && this.fetchDonations();
      refresh && this.newDonation();
      this.setState({showForm: false});
    }.bind(this));
  }

  handleDelete = (donationid) => {
    this.setState({
      deleteAction: true,
      donationToDelete: donationid
    })
  }

  closeDelete = () => {
    this.setState({
      deleteAction: false
    })
  }

  deleteDonation = (donationid) => {
    axios({
      method: 'post',
      url: '/donation/delete',
      data: { donationid }
    })
    .then(function(response, body) {
      this.closeDelete();
      this.newDonation();
      this.props.envelopeId && this.fetchDonations();
      this.props.refreshCallback && this.props.refreshCallback();
    }.bind(this));
  }

  render() {
    let donationsHeader = ["Member", "Date", "Amount"];
    this.props.memberId && (donationsHeader = ["Date", "Amount"]);
    this.props.isStatement && (donationsHeader = ["Fund", "Date", "Amount"]);
    this.props.isPrintable && (donationsHeader = ["Date", "Payment Type", "Fund", "Amount"]);

    let donations = [];
    this.props.isStatement && (
      this.props.donations.map(
        (donation, index) => {
          donations.push(
            [
              donation.id,
              donation.fundname,
              donation.paydate ? donation.paydate.split('T')[0] : '',
              donation.amount
            ]
          );
          return null;
        }
      )
    );

    let total = 0;
    if (this.props.isPrintable) {
      donations = [];
      this.props.donations.map(
        (donation, index) => {
          total = total + donation.amount;
          donation.amount > 0 && donations.push(
            [
              donation.id,
              donation.paydate ? donation.paydate.split('T')[0] : '',
              donation.paymenttype,
              donation.fundname,
              '$ ' + donation.amount
            ]
          );
          return null;
        }
      );
      donations.push(
        [
          0,
          'TOTAL',
          '',
          '',
          '$ ' + total
        ]
      );
    }

    (
      this.state.donations.map(
        (donation, index) => {
          let found = false;
          donations.map((don) => {
            if (don[0] === donation.id) {
              don[3] += donation.amount;
              found = true;
            }
            return null;
          });

          if (!found) {
            if (this.props.memberId) {
              donations.push(
                [
                  donation.id,
                  donation.paydate ? donation.paydate.split('T')[0] : '',
                  donation.amount
                ]
              )
            }
            else {
              donations.push(
                [
                  donation.id,
                  <span className={donation.active ? '' : 'inactive'}>{donation.firstname + " " + donation.lastname}</span>,
                  donation.paydate ? donation.paydate.split('T')[0] : '',
                  donation.amount
                ]
              )
            }
          }
          return null;
        }
      )
    );

    let actions = [];

    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant');
    
    hasAccess && (
      actions = this.props.isPrintable ? [] : [
        {
          type: 'edit',
          action: this.editDonation,
          label: 'Edit'
        },
        {
          type: 'delete',
          action: this.handleDelete,
          label: 'Delete'
        }
      ]
    )

    return (
      <GridContainer>
        <AlertDialog
            open={this.state.deleteAction}
            onClose={this.closeDelete}
            onDecline={this.closeDelete}
            onAccept={() => this.deleteDonation(this.state.donationToDelete)}
            acceptLabel={'Accept'}
            declineLabel={'Decline'}
            dialogTitle={'Deleting Donation'}
            dialogContent={'Are you sure you want to delete this donation? This action is not reversible.'}
        />
        <GridItem xs={12} sm={12} md={12}>
          {
            !this.props.isPrintable && (
              <h6 className="form-subtitle transaction-form">Donations</h6>
            )
          }
        </GridItem>
        <GridItem xs={12} sm={12} md={this.props.fullWidth ? 12 : 6}>
          <Table
            tableHeaderColor="primary"
            tableHead={donationsHeader}
            tableData={donations}
            onRowClick={this.onRowClick}
            onRowMouseOver={this.onRowMouseOver}
            rowActions={actions}
          />
        </GridItem>
        {
          !this.props.fullWidth && (
            <GridItem xs={12} sm={12} md={6}>
            <br />
            <div className="right">
            <Button className="form-button float-right" color="info" size="sm" onClick={this.saveDonation} disabled={!this.state.member}>Save</Button>
              <Button className="form-button float-right" color="warning" size="sm" onClick={this.newDonation}>Add Donation</Button>
            </div>
            {this.state.showForm && this.donationForm()}
            </GridItem>
          )
        }
      </GridContainer>
    )
  }
}

DonationsList.propTypes = {
  envelopeId: PropTypes.number,
  envelopeDate: PropTypes.string,
  fullWidth: PropTypes.bool,
  memberId: PropTypes.number,
  donations: PropTypes.array,
  isStatement: PropTypes.bool,
  isPrintable: PropTypes.bool,
  refreshCallback: PropTypes.func
};

export default connect(
  ({ account }) => ({ account }),
  null
)( DonationsList );
