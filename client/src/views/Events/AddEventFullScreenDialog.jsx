import React from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import CloseIcon from '@material-ui/icons/Close';
import Button from "components/CustomButtons/Button.jsx";
import Checkbox from "components/CustomInput/CustomCheckbox.jsx";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import ToolBar from "components/ToolBar/ToolBar.jsx";
import MemberSelect from '../utils/MemberSelect';
import GroupSelect from '../utils/GroupSelect';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class AddEventFullScreenDialog extends React.Component {
  static defaultProps = {
    title: "Add Event",
    moreLabel: "MORE OPTIONS",
    addLabel: "SAVE",
    eventLabel: "Event Title",
    startLabel: "Start Time",
    endLabel: "End Time"
  }

  constructor(props) {
    super(props);
    this.state = {
      repeat: 'none',
      tabValue: 'details',

      eventValue: '',
      startDate: '',
      endDate: '',

      location: '',

      guests: [],
      groups: [],
      opening: false,

      allday: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.opening && nextProps.open) {
      if (nextProps.eventId) {
        return {
          eventValue: nextProps.eventValue,
          opening: true,
          startDate: nextProps.start,
          endDate: nextProps.end,
          allday: nextProps.allday,
          location: nextProps.location,
          repeat: nextProps.repeat || 'none',
          guests: nextProps.guests,
          groups: nextProps.groups

        }
      } else {
        return {
          eventValue: nextProps.eventValue,
          opening: true,
          startDate: nextProps.start,
          endDate: nextProps.end
        }
      }
    }
    return null;
  }

  handleClose = (shouldRefresh) => {
    this.setState({
      opening: false,
      eventValue: '',
      location: '',
      startDate: '',
      endDate: '',
      allday: false,
      repeat: 'none',
      guests: [],
      groups: []
    });
    this.props.refresh && this.props.refresh();
    this.props.onClose && this.props.onClose(shouldRefresh);
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleOnCheck = (e, checked, state) => {
    this.setState({
      [state]: checked
    });
  }

  handleMemberInvite = () => value => {
    const guests = this.state.guests;
    if (this.checkIfObjectInArray(value, guests) === -1) {
      guests.push(value);
      this.setState({
        guests
      });
    }
  }

  deleteGuest = (guest) => {
    const guests = this.state.guests;
    const index = this.checkIfObjectInArray(guest, guests);
    if (index > -1) {
      guests.splice(index, 1);
      this.setState({
        guests
      });
    }
  }

  handleGroupInvite = () => value => {
    const groups = this.state.groups;
    if (this.checkIfObjectInArray(value, groups) === -1) {
      groups.push(value);
      this.setState({
        groups
      });
    }
  }

  deleteGroup = (group) => {
    const groups = this.state.groups;
    const index = this.checkIfObjectInArray(group, groups);
    if (index > -1) {
      groups.splice(index, 1);
      this.setState({
        groups
      });
    }
  }

  checkIfObjectInArray = (obj, array) => {
    let found = -1;
    array.map((o, i) => {
      if (o.id === obj.id) {
        found = i;
      }
      return null;
    });
    return found;
  }

  handleDelete = () => {
    let event = {
      eventid: this.props.eventId
    }
    let api = '/event/delete';

    axios({
      method: 'post',
      url: api,
      data: event
    })
    .then(function(response) {
      this.handleClose(true);
    }.bind(this));
  }

  handleSave = () => {
    const {
      eventValue,
      location,
      startDate,
      endDate,
      allday,
      repeat,
      guests,
      groups
    } = this.state;

    let event = {
      description: eventValue,
      location,
      startdate: startDate,
      enddate: endDate,
      allday,
      repeat,
      guests,
      groups
    }
    let api = '/event/new';
    if (this.props.eventId){
      event = {
        eventid: this.props.eventId,
        description: eventValue,
        location,
        startdate: startDate,
        enddate: endDate,
        allday,
        repeat,
        guests,
        groups
      }
      api = '/event/update';
    }

    axios({
      method: 'post',
      url: api,
      data: event
    })
    .then(function(response) {
      this.handleClose(true);
    }.bind(this));
  }

  render() {
    const toolBarIcons = (
      <span>
        <Tooltip title="Cancel">
          <IconButton color="inherit" onClick={() => this.handleClose()} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </span>
    );

    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant');

    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={() => this.handleClose()}
        TransitionComponent={Transition}
        className="full-screen-dialog"
      >
        <ToolBar
          toolBarIcons={toolBarIcons}
          title={this.props.eventId ? 'Edit Event' : this.props.title}
        />
        <DialogContent>
          <CustomInput
            labelText={this.props.eventLabel}
            id="name"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              autoFocus: true,
              disabled: !hasAccess,
              value: this.state.eventValue,
              onChange: (e) => this.handleInputChange(e, 'eventValue')
            }}
          />
          <Checkbox
            onChange={(e, checked) => { this.handleOnCheck(e, checked, 'allday'); }}
            checked={this.state.allday}
            disabled={!hasAccess}
          /> All day
          
          <CustomInput
            labelText={this.props.startLabel}
            id="name"
            formControlProps={{
              fullWidth: false
            }}
            inputProps={{
              style: {marginLeft: '40px'},
              disabled: !hasAccess,
              type: "datetime-local",
              value: this.state.startDate.includes('T') ? this.state.startDate : this.state.startDate + 'T00:00',
              onChange: (e) => this.handleInputChange(e, 'startDate')
            }}
            labelProps={{
              style: {marginLeft: '40px'},
              shrink: true
            }}
          />
          <CustomInput
            labelText={this.props.endLabel}
            id="name"
            formControlProps={{
              fullWidth: false
            }}
            inputProps={{
              type: "datetime-local",
              disabled: !hasAccess,
              value: this.state.endDate.includes('T') ? this.state.endDate : this.state.endDate + 'T00:00',
              onChange: (e) => this.handleInputChange(e, 'endDate')
            }}
            labelProps={{
              shrink: true
            }}
          />
          <Select
            value={this.state.repeat}
            onChange={(e) => this.handleInputChange(e, 'repeat')}
            inputProps={{
              name: 'repeat',
              id: 'repeat',
              disabled: !hasAccess,
            }}
            className="repeat-select"
          >
            <MenuItem value={'none'}>Does Not repeat</MenuItem>
            <MenuItem value={'daily'}>Daily</MenuItem>
            <MenuItem value={'weekly'}>Weekly</MenuItem>
            <MenuItem value={'biweekly'}>Bi Weekly</MenuItem>
            <MenuItem value={'monthly'}>Monthly</MenuItem>
            <MenuItem value={'yearly'}>Yearly</MenuItem>
          </Select>
          <div className="clear" />
          <Tabs
            className='event-tabs'
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            classes={
          {indicator: 'tabs-indicator'}
        }
          >
            <Tab
              value='details'
              disableRipple
              label="EVENT DETAILS"
            />
            {
              hasAccess && (
                <Tab
                  value='guests'
                  disableRipple
                  label="GUESTS"
                />
              )
            }
          </Tabs>
          {this.state.tabValue === 'details' && <TabContainer>
            <CustomInput
              labelText={'Location'}
              id="location"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: !hasAccess,
                value: this.state.location,
                onChange: (e) => this.handleInputChange(e, 'location')
              }}
            />
          </TabContainer>}
          {this.state.tabValue === 'guests' && hasAccess && <TabContainer>
            <div style={{width: 'calc(50% - 20px)', float: 'left', padding: '0 10px'}}>
              <MemberSelect
                placeholder="Invite Members"
                value={''}
                onChange={this.handleMemberInvite()}
              />
              <div>
                {
                  this.state.guests.map((guest, index) => {
                    return (
                      <p key={index}>
                        <IconButton color="inherit" aria-label="Delete" onClick={() => this.deleteGuest(guest)}>
                          <CloseIcon />
                        </IconButton>
                        <span>{guest.label}</span>
                      </p>
                    )
                  })
                }
              </div>
            </div>

            <div style={{width: 'calc(50% - 20px)', float: 'left', padding: '0 10px'}}>
              <GroupSelect
                placeholder="Invite Groups"
                value={''}
                onChange={this.handleGroupInvite()}
              />
              <div>
                {
                  this.state.groups.map((group, index) => {
                    return (
                      <p key={index}>
                        <IconButton color="inherit" aria-label="Delete" onClick={() => this.deleteGroup(group, 'groups')}>
                          <CloseIcon />
                        </IconButton>
                        <span>{group.label}</span>
                      </p>
                    )
                  })
                }
              </div>
            </div>
          </TabContainer>}
          <div className="clear" />
        </DialogContent>
        {hasAccess && (
          <DialogActions>
            {
              this.props.eventId && (
                <Button onClick={this.handleDelete} color="danger" className="left">
                  Delete
                </Button>
              )
            }
            <Button
              onClick={this.handleSave}
              color="info"
              disabled={!this.state.eventValue
                || this.state.eventValue.length === 0}
            >
              Save
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
}

AddEventFullScreenDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  moreLabel: PropTypes.string,
  addLabel: PropTypes.string,
  eventLabel: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  startEnd: PropTypes.object,
  eventValue: PropTypes.string,
  allDay: PropTypes.bool
};

export default connect(
  ({ account }) => ({ account }),
  null
)( withStyles(styles)(AddEventFullScreenDialog) );
