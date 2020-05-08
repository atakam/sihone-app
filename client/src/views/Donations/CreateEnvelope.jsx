import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import AlertDialog from "components/Dialog/AlertDialog";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import DonationsList from './DonationsList.jsx'

import Utils from "../utils/Utils";

class CreateEnvelope extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      descriptiontext: '',
      envelopedate: Utils.getDateString(new Date(), false),
      isopen: 'open',
      notificationOpen: false,

      deleteAction: false,
      notificationDeleteErrorOpen: false,

      account: 0,
      accounts: []
    };
  }

  componentDidMount() {
    this.props.envelopeId && this.fetchEnvelope();
    this.fetchAccounts();
  }

  fetchEnvelope = () => {
    fetch('/envelope/find/' + this.props.envelopeId)
    .then(response => response.json())
    .then(json => {
      console.log('envelope', json.envelope);
      this.setState({
        descriptiontext: json.envelope.descriptiontext,
        envelopedate: json.envelope.envelopedate.split('T')[0],
        isopen: json.envelope.isopen ? 'open' : 'close',
        account: json.envelope.accountid
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchAccounts = () => {
    fetch('/account/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      const accounts = this.state.accounts;
      
      json.accounts.map((account, index) => {
        accounts.push({
          value: account.id,
          label: account.descriptiontext
        });
        
        if (!account.candelete) {
          this.setState({
            account: account.id
          })
        }
        return null;
      });

      this.setState({
        accounts
      })
    })
    .catch(error => console.log('error', error));
  }

  handleSave = (event) => {
    event.preventDefault();
    const {
      descriptiontext,
      envelopedate,
      isopen,
      account
    } = this.state

    let envelope = {
      descriptiontext,
      envelopedate,
      isopen: isopen === 'open',
      accountid: account
    }
    let api = '/envelope/new';
    if (this.props.hasOwnProperty('envelopeId')){
      envelope = {
        envelopeid: this.props.envelopeId,
        descriptiontext,
        envelopedate,
        isopen: isopen === 'open',
        accountid: account
      }
      api = '/envelope/update';
    }

    axios({
      method: 'post',
      url: api,
      data: envelope
    })
    .then(function(response, body) {
      this.setState({
        notificationOpen: true
      });
      if (!this.props.hasOwnProperty('envelopeId')){
        this.setState({
          descriptiontext: '',
          envelopedate: '',
          isopen: 1
        });
      }
    }.bind(this));
  }

  handleDelete = (event) => {
    event.preventDefault();
    this.state.donationNumber === 0 && this.setState({
      deleteAction: true
    })
    this.setState({
      notificationDeleteErrorOpen: this.state.donationNumber > 0
    });
  }

  closeDelete = () => {
    this.setState({
      deleteAction: false
    })
  }

  deleteAction = () => {
    const envelope = {
      envelopeid: this.props.envelopeId
    }

    axios({
      method: 'post',
      url: '/envelope/delete',
      data: envelope
    })
    .then(function(response, body) {
      this.setState({
        deleteAction: false
      });
      this.props.onClose && this.props.onClose();
      response.statusCode === 200 && this.props.onClose();
    }.bind(this));
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  closeNotification = () => {
    this.setState({
      notificationOpen: false,
      notificationDeleteErrorOpen: false
    });
  }

  setDonationNumber = (donationNumber) => {
    this.setState({
      donationNumber
    });
  }

  render () {
    const {
      descriptiontext,
      envelopedate,
      isopen,
      notificationOpen,
      notificationDeleteErrorOpen,

      accounts,
      account
    } = this.state

    const status = [
      {
        value: 'open',
        label: 'Open',
      },
      {
        value: 'close',
        label: 'Close',
      }
    ];

    return (
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
              'ERROR - Cannot delete Envelope. Remove all donation entries first!'
            }
            close
            place="tc"
            color="danger"
            open={notificationDeleteErrorOpen}
            closeNotification={this.closeNotification}
        />
        <AlertDialog
            open={this.state.deleteAction}
            onClose={this.closeDelete}
            onDecline={this.closeDelete}
            onAccept={this.deleteAction}
            acceptLabel={'Accept'}
            declineLabel={'Decline'}
            dialogTitle={'Deleting Envelope'}
            dialogContent={'Are you sure you want to delete this envelope? This action is not reversible.'}
        />
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            {
              this.props.hasOwnProperty('envelopeId') ? (
                null
              ) : (
                <CardHeader color={'success'}>
                  {this.props.tabs}
                </CardHeader>
              )
            }
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Envelope Description"
                    id="name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: descriptiontext,
                      onChange: (e) => this.handleInputChange(e, 'descriptiontext')
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    id="select-account"
                    select
                    label="Account"
                    value={account}
                    onChange={(e) => this.handleInputChange(e, 'account')}
                    margin="normal"
                    fullWidth
                    className="select-input"
                  >
                    {accounts.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Date"
                    id="date"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type:"date",
                      value: envelopedate,
                      onChange: (e) => this.handleInputChange(e, 'envelopedate')
                    }}
                    labelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    id="select-status"
                    select
                    label="Status"
                    value={isopen}
                    onChange={(e) => this.handleInputChange(e, 'isopen')}
                    margin="normal"
                    fullWidth
                    className="select-input"
                  >
                    {status.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              {
                this.props.hasOwnProperty('envelopeId') ? (
                  <Button color="danger" className='add-button create' onClick={this.handleDelete}>
                    Delete
                  </Button>
                ) : (
                  <span />
                )
              }
              <Button className="right" color="info" onClick={this.handleSave}>Save</Button>
            </CardFooter>
          </Card>
          {
                this.props.hasOwnProperty('envelopeId') ? (
                  <DonationsList
                    envelopeId={this.props.envelopeId}
                    envelopeDate={this.state.envelopedate}
                    setDonationNumber={this.setDonationNumber}
                  />
                ) : null
          }
        </GridItem>
      </GridContainer>
    )
  }
}

CreateEnvelope.propTypes = {
  envelopeId: PropTypes.number,
  onClose: PropTypes.func
};

export default CreateEnvelope;
