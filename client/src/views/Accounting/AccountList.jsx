import React from "react";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import AccountView from './AccountView.jsx';

import Utils from "../utils/Utils";

class AccountList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openAccount: false,
      accountId: 0,
      accounts: []
    };
  }

  onRowClick = (id) => {
    this.setState({ openAccount: true, accountId: id });
  };

  handleCloseAccount = () => {
    this.setState({ openAccount: false });
    this.fetchAccounts();
  };

  componentDidMount () {
    this.fetchAccounts();
  }

  fetchAccounts = () => {
    fetch('/account/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        accounts: json.accounts
      });
    })
    .catch(error => console.log('error', error));
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={'danger'}>
              {this.props.tabs}
            </CardHeader>
            <CardBody>
              <CustomInput
                labelText="Search accounts by name, category, fund or balance"
                id="search-accounts"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  autoFocus: true,
                  onKeyUp: (event) => Utils.searchTable(event.target, 'accounts-table')
                }}
              />
              <Table
                id="accounts-table"
                tableHeaderColor="primary"
                tableHead={["Name", "Creation Date", "Balance"]} //TODO: currency
                tableData={
                  this.state.accounts.map(
                    (account, index) => {
                      let balance = 0;
                      account.transactions.map((transaction) => {
                        if (transaction.transactiontype === 'expense') {
                          balance = balance - transaction.amount;
                        } else if (transaction.transactiontype === 'income') {
                          balance = balance + transaction.amount;
                        }
                        return null;
                      });
                      account.envelopes.map((envelope) => {
                        envelope.donations.map((donation) => {
                          balance = balance + donation.amount;
                          return null;
                        });
                        return null;
                      });
                      return (
                        [
                          account.id,
                          account.descriptiontext,
                          account.accountdate ? account.accountdate.split('T')[0] : null,
                          balance
                        ]
                      );
                    }
                  )
                }
                onRowClick={this.onRowClick}
                onRowMouseOver={this.onRowMouseOver}
              />
            </CardBody>
          </Card>
        </GridItem>
        <AccountView
          open={this.state.openAccount}
          onClose={this.handleCloseAccount}
          accountId={this.state.accountId}
        />
      </GridContainer>
    )
  }
}

export default AccountList;
