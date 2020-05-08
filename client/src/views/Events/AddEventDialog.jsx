import React from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

export default class AddEventDialog extends React.Component {
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
      eventValue: '',
      startDate: '',
      endDate: '',
      opening: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.opening && nextProps.open) {
      return {
        opening: true,
        startDate: nextProps.start,
        endDate: nextProps.end
      }
    }
    return null;
  }

  handleMoreDetails = () => {
    this.props.openFullScreen && this.props.openFullScreen({
      eventValue: this.state.eventValue,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    });
    this.handleClose(false);
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleClose = (shouldRefresh) => {
    this.setState({
      eventValue: '',
      opening: false
    });
    this.props.onClose && this.props.onClose(shouldRefresh);
  }

  handleSave = () => {
    const {
      eventValue,
      location,
      startDate,
      endDate,
      allday
    } = this.state;

    let event = {
      description: eventValue,
      location,
      startdate: startDate,
      enddate: endDate,
      allday
    }
    let api = '/event/new';

    axios({
      method: 'post',
      url: api,
      data: event
    })
    .then(function(response) {
      this.props.refresh && this.props.refresh();
      this.handleClose(true);
    }.bind(this));
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.handleClose()}
        aria-labelledby="form-dialog-title"
        onEnter={this.handleEnter}
      >
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <IconButton color="inherit" className="event close-button" onClick={() => this.handleClose()} aria-label="Close">
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <CustomInput
            labelText={this.props.eventLabel}
            id="name"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              autoFocus: true,
              value: this.state.eventValue,
              onChange: (e) => this.handleInputChange(e, 'eventValue')
            }}
          />
        </DialogContent>
        <DialogContent>
          <CustomInput
            labelText={this.props.startLabel}
            id="name"
            formControlProps={{
              fullWidth: false
            }}
            inputProps={{
              type: "datetime-local",
              value: this.state.startDate,
              onChange: (e) => this.handleInputChange(e, 'startDate')
            }}
            labelProps={{
              shrink: true,
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
              value: this.state.endDate,
              onChange: (e) => this.handleInputChange(e, 'endDate')
            }}
            labelProps={{
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleMoreDetails} color="white">
            {this.props.moreLabel}
          </Button>
          <Button
            onClick={this.handleSave}
            color="info"
            disabled={!this.state.eventValue
              || this.state.eventValue.length === 0}
          >
            {this.props.addLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddEventDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  moreLabel: PropTypes.string,
  addLabel: PropTypes.string,
  eventLabel: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  startEnd: PropTypes.object,
  allDay: PropTypes.bool,
  openFullScreen: PropTypes.func
};
