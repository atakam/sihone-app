import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import MemberSelect from '../utils/MemberSelect.jsx';
import DonationsList from './DonationsList.jsx';
import StatementSummary from './StatementSummary';

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import combineReducers from "../../reducers";

class Statements extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      memberId: props.memberId,
      filter: 'quick',
      quickFilter: 'last30',

      from: '',
      to: '',
      filterRange: '',
      donations: [],

      member: '',
      fetchedMember: {}
    };
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleMemberChange = name => value => {
    this.setState({
      [name]: value,
      memberId: value.id
    });
  };

  onRowClick = (id) => {
    // TODO:
  };

  componentDidMount() {
    this.fetchSettings();
  }

  handleSearch = () => {
    const {
      filter
    } = this.state;

    if (filter === 'custom') {
      this.fetchCustomDonations();
    }
    else {
      this.fetchQuickDonations();
    }
  }

  fetchQuickDonations = () => {
    let memberId = this.state.memberId;
    if (this.state.member.value) {
      memberId = this.state.member.value;
    }
    fetch(`/donation/find/quick/${memberId}/${this.state.quickFilter}`)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        donations: json.donations,
        filterRange: json.quickFilterRange
      })
      this.fetchMember();
    })
    .catch(error => console.log('error', error));
  }

  fetchMember = () => {
    let memberId = this.state.memberId;

    fetch(`/member/find/${memberId}`)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        fetchedMember: json.member
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchCustomDonations = () => {
    fetch('/donation/find/custom/'+this.state.memberId+'/'+this.state.to+'/'+this.state.from)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        donations: json.donations,
        filterRange: this.state.from + ' - ' + this.state.to
      })
      this.fetchMember();
    })
    .catch(error => console.log('error', error));
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        settings: json.settings
      })
    })
    .catch(error => console.log('error', error));
  }

  handleDownloadView = () => {
    const donationsView = (
      <DonationsList
        memberId={this.state.memberId}
        className="statement-data" fullWidth
        isStatement
        donations={this.state.donations}
        isPrintable
      />
    );

    const summaryView = (
      <StatementSummary
        className="statement-data" fullWidth
        donations={this.state.donations}
      />
    );

    const {
      settings,
      filter,
      from,
      to,
      filterRange,
      fetchedMember
    } = this.state;

    const rangeValue = filter === 'cutom' ? (from + ' - ' + to) : filterRange;
    
    var container = document.createElement('div');
    
    var print = document.createElement('button');
    print.appendChild(document.createTextNode('PRINT'));
    print.setAttribute('class', 'print');
    print.setAttribute('onclick', 'window.print();');
    container.appendChild(print);

    var view = document.createElement('div');
    view.setAttribute('class', 'printableArea');
    container.appendChild(view);

    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    view.appendChild(title);

    var orgname = document.createElement('p');
    orgname.appendChild(document.createTextNode(settings.churchname));
    title.appendChild(orgname);

    var subname = document.createElement('p');
    subname.appendChild(document.createTextNode('Giving Statement'));
    title.appendChild(subname);

    var membername = document.createElement('p');
    membername.setAttribute('class', 'membername');
    membername.appendChild(document.createTextNode((fetchedMember.firstname || '') + ' ' + (fetchedMember.lastname || '')));
    title.appendChild(membername);

    var memberaddess = document.createElement('p');
    memberaddess.setAttribute('class', 'memberaddress');
    memberaddess.appendChild(document.createTextNode(fetchedMember.streetaddress || ''));
    title.appendChild(memberaddess);

    var memberaddess2 = document.createElement('p');
    memberaddess2.setAttribute('class', 'memberaddress');
    memberaddess2.appendChild(document.createTextNode((fetchedMember.city || '') + ' ' + (fetchedMember.province || '') + ' ' + (fetchedMember.postalcode || '')));
    title.appendChild(memberaddess2);

    var memberaddess3 = document.createElement('p');
    memberaddess3.setAttribute('class', 'memberaddress');
    memberaddess3.appendChild(document.createTextNode(fetchedMember.country || ''));
    title.appendChild(memberaddess3);

    var dates = document.createElement('div');
    dates.setAttribute('class', 'dates');
    view.appendChild(dates);

    var filterdate = document.createElement('p');
    filterdate.appendChild(document.createTextNode(rangeValue));
    dates.appendChild(filterdate);

    var today = document.createElement('p');
    today.appendChild(document.createTextNode('as of ' + (new Date()).toString().split('GMT')[0]));
    dates.appendChild(today);

    var memberid = document.createElement('p');
    memberid.appendChild(document.createTextNode(fetchedMember.memberuid));
    dates.appendChild(memberid);

    var donationElement = document.createElement('div');
    donationElement.setAttribute('class', 'table');

    const store = createStore(
      combineReducers,
      applyMiddleware(thunk)
    );

    ReactDOM.render(
      <Provider store={store}>
          {donationsView}
      </Provider>,
      donationElement
  );
    view.appendChild(donationElement);

    var summary = document.createElement('div');
    summary.setAttribute('class', 'summary');
    ReactDOM.render( summaryView, summary );
    view.appendChild(summary);

    var clear = document.createElement('div');
    clear.setAttribute('class', 'clear');
    view.appendChild(clear);

    var footer1 = document.createElement('div');
    footer1.setAttribute('class', 'footer1');
    view.appendChild(footer1);

    var orgname2 = document.createElement('p');
    orgname2.appendChild(document.createTextNode(settings.churchname));
    footer1.appendChild(orgname2);

    var orgaddress = document.createElement('p');
    orgaddress.appendChild(document.createTextNode(settings.streetaddress));
    footer1.appendChild(orgaddress);

    var orgaddress2 = document.createElement('p');
    orgaddress2.appendChild(document.createTextNode(settings.city + ' ' + settings.province + ' ' + settings.postalcode));
    footer1.appendChild(orgaddress2);

    var footer2 = document.createElement('div');
    footer2.setAttribute('class', 'footer2');
    view.appendChild(footer2);

    var message = document.createElement('p');
    message.appendChild(document.createTextNode(`
    This receipt represents your donation for the period of
    ${rangeValue}. We thank you
    for your generous donation. Our Charitable
    Registration Number is ${settings.charitynumber}.
    www.cra.gc.ca/charities.
    `));
    footer2.appendChild(message);

    var signature = document.createElement('p');
    signature.setAttribute('class', 'signature');
    signature.appendChild(document.createTextNode('Authorized Signature:'));
    footer2.appendChild(signature);

    var css = document.createElement('style');
    css.type = 'text/css';

    var styles = 'body { margin: 40px; font: normal 14px Arial, sans-serif;}';
    styles += ' .title { font-weight: bold; width: 80%; float: left; margin-bottom: 40px; margin-top: 20px; }';
    styles += ' .dates { font-size: 10px; width: 20%; float: right; margin-bottom: 40px; text-align: right; }';
    styles += ' .print {float: right; margin-bottom: 20px; }';
    styles += ' p { margin: 2px; }';
    styles += ' .summary { width: 50%; float: left;margin-top: 40px; }';
    styles += ' .signature { margin-bottom: 150px !important; }';
    styles += ' .footer1 { width: 50%; float: left;margin-top: 40px; font-weight: bold; }';
    styles += ' .footer2 { width: 50%; float: right;margin-top: 40px; }';
    styles += ' .footer2 p { margin-bottom: 20px; }';
    styles += ' .membername { margin-top: 20px; }';
    styles += ' .memberaddress { font-weight: normal; }';
    styles += ' .clear { clear: both }';
    styles += `table {
      border: solid 1px #DDEEEE;
      border-collapse: collapse;
      border-spacing: 0;
      font: normal 13px Arial, sans-serif;
      width: 100%;
      margin-top: 40px;
  }
  table thead th {
      background-color: #DDEFEF;
      border: solid 1px #DDEEEE;
      color: #336B6B;
      padding: 10px;
      text-align: left;
      text-shadow: 1px 1px 1px #fff;
  }
  table tbody td {
      border: solid 1px #DDEEEE;
      color: #333;
      padding: 10px;
      text-shadow: 1px 1px 1px #fff;
  }
  table td:last-child {
    text-align: right;
  }
  table tr:last-child {
    font-weight: bold;
    border-top: 2px solid #DDEEEE;
  }`;

    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));

    var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=800,top="+(window.height-400)+",left="+(window.width-840));
    win.document.body.innerHTML = container.innerHTML;
    win.document.getElementsByTagName("head")[0].appendChild(css);
  }

  render() {
    const filters = [
      {
        value: 'quick',
        label: 'Quick Filter',
      },
      {
        value: 'custom',
        label: 'Custom Filter',
      }
    ];

    const qFilters = [
      {
        value: 'last30',
        label: 'Last 30 days',
      },
      {
        value: 'last60',
        label: 'Last 60 days',
      },
      {
        value: 'last90',
        label: 'Last 90 days',
      },
      {
        value: 'thisYear',
        label: 'This Year',
      },
      {
        value: 'lastYear',
        label: 'Last Year',
      }
    ];

    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant');

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={'success'}>
              {this.props.tabs}
            </CardHeader>
            <CardBody className="statement-body">
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  {
                    hasAccess ? (
                      <GridItem xs={12} sm={12} md={12}>
                        <MemberSelect
                          placeholder="Search member"
                          value={this.state.member}
                          onChange={this.handleMemberChange('member')}
                        />
                      </GridItem>
                    ) : (
                      null
                    )
                  }
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      id="select-filter"
                      select
                      label="Select Filter"
                      value={this.state.filter}
                      onChange={(e) => {this.handleInputChange(e, 'filter')}}
                      margin="normal"
                      className="select-input"
                      fullWidth
                    >
                      {filters.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </GridItem>
                  {
                    this.state.filter === 'quick' && (
                      <GridItem xs={12} sm={12} md={12}>
                        <TextField
                          id="select-quick-filter"
                          select
                          label="Quick Filter"
                          value={this.state.quickFilter}
                          onChange={(e) => {this.handleInputChange(e, 'quickFilter')}}
                          margin="normal"
                          className="select-input"
                          fullWidth
                        >
                          {qFilters.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </GridItem>
                    )
                  }
                  {
                    this.state.filter === 'custom' && (
                        <GridItem xs={12} sm={12} md={12}>
                          <CustomInput
                            labelText="From"
                            id="from"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: 'date',
                              value: this.state.from,
                              onChange:(e) => {this.handleInputChange(e, 'from')}
                            }}
                            labelProps={{
                              shrink: true
                            }}
                          />
                        </GridItem>
                      )
                    }
                    {this.state.filter === 'custom' && (
                        <GridItem xs={12} sm={12} md={12}>
                          <CustomInput
                            labelText="To"
                            id="to"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type:'date',
                              value: this.state.to,
                              onChange:(e) => {this.handleInputChange(e, 'to')}
                            }}
                            labelProps={{
                              shrink: true
                            }}
                          />
                        </GridItem>
                    )
                  }
                  
                    <GridItem xs={12} sm={6} md={1}>
                      <Button
                        color="info"
                        className='add-button'
                        onClick={this.handleSearch}
                        disabled={(this.state.member === '' && hasAccess) ||
                          (this.state.filter === 'custom' && (this.state.from === '' || this.state.to === '')) ||
                          (new Date(this.state.from) > new Date(this.state.to))}
                      >
                        Search
                      </Button>
                    </GridItem>
                    <GridItem >
                      {
                        (new Date(this.state.from) > new Date(this.state.to)) && (
                          <div className="login-error">The date 'from' must come before the date 'to'.</div>
                        )
                      }
                    </GridItem>
                </GridItem>
                <GridItem xs={12} sm={12} md={7}>
                  {
                    this.state.donations.length > 0 ? (
                      <a className='float-left-top click'
                        onClick={this.handleDownloadView}>
                        View Download Format
                      </a>
                    ) : null
                  }
                  <DonationsList
                    memberId={this.state.memberId}
                    className="statement-data" fullWidth
                    isStatement
                    donations={this.state.donations}
                    refreshCallback={this.fetchQuickDonations}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    )
  }
}

export default connect(
  ({ account }) => ({ account }),
  null
)( Statements );
