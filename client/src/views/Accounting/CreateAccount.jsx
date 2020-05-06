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

import TransactionsList from './TransactionsList.jsx'
import EnvelopeList from "../Donations/EnvelopeList";

class CreateAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      descriptiontext: '',
      canDelete: false,
      notificationOpen: false,
      notificationDeleteErrorOpen: false,
      deleteAction: false,
      transactionNumber: 0
    };
  }

  componentDidMount() {
    this.props.accountId && this.fetchAccount();
  }

  fetchAccount = () => {
    fetch('/account/find/' + this.props.accountId)
    .then(response => response.json())
    .then(json => {
      console.log('account', json.account);
      this.setState({
        descriptiontext: json.account.descriptiontext,
        canDelete: json.account.candelete
      })
    })
    .catch(error => console.log('error', error));
  }

  handleSave = (event) => {
    event.preventDefault();
    const {
      descriptiontext
    } = this.state

    let member = {
      descriptiontext
    }
    let api = '/account/new';
    if (this.props.hasOwnProperty('accountId')){
      member = {
        accountid: this.props.accountId,
        descriptiontext
      }
      api = '/account/update';
    }

    axios({
      method: 'post',
      url: api,
      data: member
    })
    .then(function(response) {
      this.setState({
        notificationOpen: true
      });
      if (!this.props.hasOwnProperty('accountId')){
        this.setState({
          descriptiontext: ''
        });
      }
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

  handleDelete = (event) => {
    event.preventDefault();
    this.state.transactionNumber === 0 && this.setState({
      deleteAction: true
    })
    this.setState({
      notificationDeleteErrorOpen: this.state.transactionNumber > 0
    });
  }

  closeDelete = () => {
    this.setState({
      deleteAction: false
    })
  }

  deleteAction = () => {
    const account = {
      accountid: this.props.accountId
    }

    axios({
      method: 'post',
      url: '/account/delete',
      data: account
    })
    .then(function(response, body) {
      this.setState({
        deleteAction: false
      });
      this.props.onClose && this.props.onClose();
      response.statusCode === 200 && this.props.onClose();
    }.bind(this));
  }

  setTransactionNumber = (transactionNumber) => {
    this.setState({
      transactionNumber
    });
  }

  render () {
    const {
      descriptiontext,
      canDelete,
      notificationOpen,
      notificationDeleteErrorOpen
    } = this.state

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
              'ERROR - Cannot delete Account. Remove all transaction entries first!'
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
            dialogTitle={'Deleting Account'}
            dialogContent={'Are you sure you want to delete this account? This action is not reversible.'}
        />
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            {
              this.props.hasOwnProperty('accountId') ? (
                null
              ) : (
                <CardHeader color={'danger'}>
                  {this.props.tabs}
                </CardHeader>
              )
            }
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Account Description"
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
              </GridContainer>
            </CardBody>
            <CardFooter>
              {
                this.props.hasOwnProperty('accountId') && canDelete ? (
                  <Button color="danger" className='add-button create' onClick={this.handleDelete.bind(this)}>
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
                this.props.hasOwnProperty('accountId') ? (
                  <TransactionsList accountId={this.props.accountId} setTransactionNumber={this.setTransactionNumber} />
                ) : null
          }
          {
                this.props.hasOwnProperty('accountId') ? (
                  <EnvelopeList accountId={this.props.accountId} />
                ) : null
          }
        </GridItem>
      </GridContainer>
    )
  }
}

CreateAccount.propTypes = {
  accountId: PropTypes.number,
  onClose: PropTypes.func
};

export default CreateAccount;
