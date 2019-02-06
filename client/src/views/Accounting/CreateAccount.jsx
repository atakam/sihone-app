import React from "react";
import PropTypes from "prop-types";
import CONFIG from "../../configs";
import request from "request";
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
      deleteAction: false
    };
  }

  componentDidMount() {
    this.props.accountId && this.fetchAccount();
  }

  fetchAccount = () => {
    fetch(CONFIG.serverUrl+'/account/find/' + this.props.accountId)
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

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl + api,
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: member
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationOpen: true
      });
      if (!this.props.hasOwnProperty('accountId')){
        this.setState({
          descriptiontext: ''
        });
      }
      console.log(body);
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
    this.setState({
      deleteAction: true
    })
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

    var options = {
      method: 'POST',
      url: CONFIG.serverUrl+'/account/delete',
      headers: 
      { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: account
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      this.setState({
        notificationDeleteErrorOpen: response.statusCode !== 200,
        deleteAction: false
      });
      response.statusCode === 200 && this.props.onClose();
      console.log(body);
    }.bind(this));
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
                <CardHeader color={'info'}>
                  <h5>Fill in the form below to create an Account</h5>
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
                this.props.hasOwnProperty('accountId') ? (
                  <TransactionsList accountId={this.props.accountId} />
                ) : null
          }
          <EnvelopeList accountId={this.props.accountId} />
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
