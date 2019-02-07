import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import AlertDialog from "components/Dialog/AlertDialog";

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';

class TransactionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],

      descriptiontext: '',
      type: 'expense',
      transactiondate: '',
      amount: '',
      receipt: '',
      transactionid: '',

      deleteAction: false,
      transactionToDelete: 0,

      showForm: false
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  componentDidMount () {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    fetch('/transaction/findAll/'+this.props.accountId)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        transactions: json.transactions
      }, this.props.setTransactionNumber(json.transactions.length))
    })
    .catch(error => console.log('error', error));
  }

  transactionForm = () => {
    const types = [
      {
        value: 'expense',
        label: 'Expense',
      },
      {
        value: 'income',
        label: 'Income',
      }
    ];

    const {
      descriptiontext,
      type,
      transactiondate,
      amount,
      receipt,
      transactionid
    } = this.state
    return (
      <div className="clear">
        <h6 className="form-subtitle transaction-form">
          {
            transactionid === '' ? (
              'New Transaction'
            ) : (
              'Edit Transaction'
            )
          }
        </h6>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6}>
            <CustomInput
              labelText={'Description'}
              id="transaction-description"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: descriptiontext,
                onChange: (e) => this.handleInputChange(e, 'descriptiontext')
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <TextField
              id="select-type"
              select
              label="Transaction Type"
              value={type}
              onChange={(e) => this.handleInputChange(e, 'type')}
              margin="normal"
              fullWidth
              className="select-input"
            >
              {types.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
                value: transactiondate,
                onChange: (e) => this.handleInputChange(e, 'transactiondate')
              }}
              labelProps={{
                shrink: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <CustomInput
              labelText={'Amount'}
              id="amount"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                startAdornment:<InputAdornment position="start">$</InputAdornment>,
                value: amount,
                onChange: (e) => this.handleInputChange(e, 'amount'),
                type: 'number'
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <CustomInput
              labelText={'Receipt'}
              id="receipt"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: 'file',
                value: receipt,
                onChange: (e) => this.handleInputChange(e, 'receipt')
              }}
              labelProps={{
                shrink: true
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }

  editTransaction = (transactionid) => {
    this.state.transactions.map((transaction) => {
      if (transaction.id === transactionid) {
        this.setState({
          descriptiontext: transaction.descriptiontext ? transaction.descriptiontext : '',
          type: transaction.transactiontype ? transaction.transactiontype : '',
          transactiondate: transaction.transactiondate ? transaction.transactiondate.split('T')[0] : '',
          amount: transaction.amount ? transaction.amount : '',
          receipt: transaction.receipt ? transaction.receipt : '',
          transactionid: transaction.id ? transaction.id : '',
          showForm: true
        });
      }
      return null;
    });
  }

  newTransaction = () => {
    this.setState({
      descriptiontext: '',
      type: 'expense',
      transactiondate: '',
      amount: '',
      receipt: '',
      transactionid: '',
      showForm: true
    });
  };

  saveTransaction = (event) => {
    event.preventDefault();
    const {
      descriptiontext,
      type,
      transactiondate,
      amount,
      receipt,
      transactionid
    } = this.state

    let transaction = {
      accountid: this.props.accountId,
      descriptiontext,
      transactiontype: type,
      transactiondate: transactiondate.split('T')[0],
      amount,
      receipt,
      transactionid
    }
    let api = '/transaction/update';
    let refresh = false;
    if (transactionid === '') {
      transaction = {
        accountid: this.props.accountId,
        descriptiontext,
        transactiontype: type,
        transactiondate: transactiondate.split('T')[0],
        amount,
        receipt
      };
      api = '/transaction/new';
      refresh = true;
    }

    axios({
      method: 'post',
      url: api,
      data: transaction
    })
    .then(function(response) {
      this.fetchTransactions();
      refresh && this.newTransaction();
      this.setState({showForm: false});
    }.bind(this));
  }

  handleDelete = (transactionid) => {
    this.setState({
      deleteAction: true,
      transactionToDelete: transactionid
    })
  }

  closeDelete = () => {
    this.setState({
      deleteAction: false
    })
  }

  deleteTransaction = (transactionid) => {
    axios({
      method: 'post',
      url: '/transaction/delete',
      data: { transactionid }
    })
    .then(function(response) {
      this.closeDelete();
      this.newTransaction();
      this.fetchTransactions();
    }.bind(this));
  }

  render() {
    const transactionsHeader = ["Description", "Date", "Amount"];
    const transactions = (
      this.state.transactions.map(
        (transaction, index) => {
          let amount = transaction.amount;
          if (transaction.transactiontype === 'expense') {
            amount = '(' + amount + ')';
          }
          return (
            [
              transaction.id,
              transaction.descriptiontext,
              transaction.transactiondate.split('T')[0],
              amount
            ]
          )
        }
      )
    );

    const actions = [
      {
        type: 'edit',
        action: this.editTransaction,
        label: 'Edit'
      },
      {
        type: 'delete',
        action: this.handleDelete,
        label: 'Delete'
      }
    ]

    return (
      <GridContainer>
        <AlertDialog
            open={this.state.deleteAction}
            onClose={this.closeDelete}
            onDecline={this.closeDelete}
            onAccept={() => this.deleteTransaction(this.state.transactionToDelete)}
            acceptLabel={'Accept'}
            declineLabel={'Decline'}
            dialogTitle={'Deleting Transaction'}
            dialogContent={'Are you sure you want to delete this transaction? This action is not reversible.'}
        />
        <GridItem xs={12} sm={12} md={12}>
          <h6 className="form-subtitle">Transactions</h6>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Table
            tableHeaderColor="primary"
            tableHead={transactionsHeader}
            tableData={transactions}
            onRowClick={this.onRowClick}
            onRowMouseOver={this.onRowMouseOver}
            rowActions={actions}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
        <br />
        <div className="right">
          <Button className="form-button float-right" color="info" size="sm" onClick={this.saveTransaction} disabled={!this.state.descriptiontext || !this.state.amount}>Save</Button>
          <Button className="form-button float-right" color="warning" size="sm" onClick={this.newTransaction}>Add Transaction</Button>
        </div>
        {this.state.showForm && this.transactionForm()}
        </GridItem>
      </GridContainer>
    )
  }
}

TransactionsList.propTypes = {
  accountId: PropTypes.number
};

export default TransactionsList;
