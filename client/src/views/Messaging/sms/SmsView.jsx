import React from "react";
import axios from "axios";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

class SmsView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fullname: '',
            phone: '',
            messages: [],
            smstext: '',

            error: '',

            openSuccess: false,
            openError: false
        };
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.props.memberId && this.fetchSmsByMember();
        this.props.groupId && this.fetchSmsByGroup();
        this.props.special && this.fetchSmsBySpecial();
    }

    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    fetchSmsByMember = () => {
        fetch('/sms/findAll/m/' + this.props.memberId)
        .then(response => response.json())
        .then(json => {
          console.log('json', json);
          this.setState({
            fullname: json.member.firstname + ' ' + json.member.lastname,
            phone: json.member.phone,
            messages: json.sms
          })
        })
        .catch(error => console.log('error', error));
    }

    fetchSmsByGroup = () => {
        fetch('/sms/findAll/g/' + this.props.groupId)
        .then(response => response.json())
        .then(json => {
          console.log('json', json);
          this.setState({
            fullname: json.group.groupname,
            phone: '',
            messages: json.sms
          })
        })
        .catch(error => console.log('error', error));
    }

    fetchSmsBySpecial = () => {
        fetch('/sms/findAll/s/' + this.props.special.value)
        .then(response => response.json())
        .then(json => {
          console.log('json', json);
          this.setState({
            fullname: this.props.special.label,
            phone: '',
            messages: json.sms
          })
        })
        .catch(error => console.log('error', error));
    }

    reset = () => {
        this.setState({
            smstext: '',
            error: ''
        });
    }

    handleSend = () => {
        const {
            memberId,
            groupId,
            special
        } = this.props;

        axios({
            method: 'post',
            url: '/sms/new',
            data: {smstext: this.state.smstext, memberid: memberId, groupid: groupId, special: special ? special.value : null}
          })
          .then(function(response, body) {
              if (response.status === 200) {
                  const json = response.data.result;
                if (json && json.messages[0].status === '0') {
                    this.setBalance(json.messages[0]['remaining-balance']);
                    this.reset();
                    this.init();
                } else {
                    this.setState({
                        error: 'Problem encountered during SMS send. ' + 
                        'This could be because of insufficient balance (consult your account at www.nexmo.com)' + 
                        ' OR the phone number is not a valid North American number.'
                    });
                }
              }
            
          }.bind(this));
    }

    setBalance = (smsbalance) => {
      
          const settings = {
            smsbalance
          }

          axios({
            method: 'post',
            url: '/settings/sms/balance',
            data: settings
          })
          .then(function(response) {});
    }

    render(){
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardBody>
                        <h4>{this.state.fullname}<span className='right'>{this.state.phone}</span></h4>
                        <div className='text-messages'>
                            {
                                this.state.messages.map((message, i) => {
                                    return (
                                        <div key={i} className="text-message-single">
                                            {message.smstext}
                                            <span>{message.smsdate ? (message.smsdate.split('T')[0] + ' ' +  (message.smsdate.split('T')[1] ? message.smsdate.split('T')[1].split('.')[0] : '')) : ''}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div>
                        <CustomInput
                            labelText="Type Text Content"
                            id="text-sms"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                multiline: true,
                                rows: 2,
                                value: this.state.smstext,
                                onChange: (e) => this.handleInputChange(e, 'smstext')
                            }}
                        />
                        <GridItem xs={12} sm={12} md={12}>
                            <Button
                            color="info"
                            className='add-button create right'
                            onClick={this.handleSend}
                            disabled={this.state.smstext.length === 0}>
                            Send
                            </Button>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <div className="login-error">{this.state.error}</div>
                        </GridItem>
                        </div>
                    </CardBody>
                </Card>
                </GridItem>
            </GridContainer>
        )
    }
}
export default SmsView;