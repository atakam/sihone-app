import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import EnvelopeView from './EnvelopeView.jsx';

import Utils from "../utils/Utils";

class EnvelopeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openEnvelope: false,
      envelopeId: 0,
      envelopes: []
    };
  }

  onRowClick = (id) => {
    this.setState({ openEnvelope: true, envelopeId: id });
  };

  handleCloseEnvelope = () => {
    this.setState({ openEnvelope: false });
    this.fetchEnvelopes();
  };

  componentDidMount () {
    this.props.hasOwnProperty('accountId') ? this.fetchEnvelopesByAccountId() : this.fetchEnvelopes();
  }

  fetchEnvelopes = () => {
    fetch('/envelope/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        envelopes: json.envelopes
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchEnvelopesByAccountId = () => {
    fetch('/envelope/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      let envelopes = [];
      json.envelopes.map((envelope) => {
        if (envelope.accountid === this.props.accountId) {
          envelopes.push(envelope);
        }
        return null;
      });
      this.setState({
        envelopes
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    const tableHeader = this.props.hasOwnProperty('accountId') ? ["Envelope Name", "Date", "Amount (CAD)", "Status"]
       : ["Envelope Name", "Account", "Date", "Amount (CAD)", "Status"]
    return (
      <GridContainer>
        {
          this.props.hasOwnProperty('accountId') ? (
            <GridItem xs={12} sm={12} md={12}>
              <h6 className="form-subtitle">Envelopes</h6>
            </GridItem>
          ) : null
        }
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            {
                !this.props.hasOwnProperty('accountId') &&
                (
                <CardHeader color={'success'}>
                  {this.props.tabs}
                </CardHeader>
                )
            }
            <CardBody>
              {
                !this.props.hasOwnProperty('accountId') ?
                (
                <CustomInput
                  labelText={'Search envelopes by name, date, type, amount or status'}
                  id="search-donations"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    autoFocus: true,
                    onKeyUp: (event) => Utils.searchTable(event.target, 'envelopes-table')
                  }}
                />
                ) : null
              }
             
              <Table
                id='envelopes-table'
                tableHeaderColor="primary"
                tableHead={tableHeader} //TODO: currency
                tableData={
                  this.state.envelopes.map(
                    (envelope, index) => {
                      let balance = 0;
                      envelope.donations.map((donation) => {
                        balance = balance + donation.amount;
                        return null;
                      });
                      if (this.props.hasOwnProperty('accountId')) {
                        return (
                          [
                            envelope.id,
                            envelope.descriptiontext,
                            envelope.envelopedate.split('T')[0],
                            balance,
                            envelope.isopen ? 'Open' : 'Closed'
                          ]
                        );
                      }
                      return (
                        [
                          envelope.id,
                          envelope.descriptiontext,
                          envelope.accountdescription,
                          envelope.envelopedate.split('T')[0],
                          balance,
                          envelope.isopen ? 'Open' : 'Closed'
                        ]
                      );
                    }
                  )
                }
                onRowClick={!this.props.hasOwnProperty('accountId') ? this.onRowClick : ()=>{}}
                onRowMouseOver={!this.props.hasOwnProperty('accountId') ? this.onRowMouseOver : ()=>{}}
              />
            </CardBody>
          </Card>
        </GridItem>
        <EnvelopeView
          open={this.state.openEnvelope}
          onClose={this.handleCloseEnvelope}
          envelopeId={this.state.envelopeId}
        />
      </GridContainer>
    )
  }
}

export default EnvelopeList;
