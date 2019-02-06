import React from 'react';
import PropTypes from "prop-types";
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
      eventValue: ''
    };
  }

  handleAddEvent = () => {
    this.props.onClose && this.props.onClose();
  }

  handleChange = (event) => {
    this.setState({eventValue: event.target.value})
  }

  handleMoreDetails = () => {
    this.props.onClose && this.props.onClose();
    this.props.openFullScreen && this.props.openFullScreen();
  }

  render() {
    let startDate = this.props.startEnd.start && this.props.startEnd.start.format()
    if (startDate && !startDate.includes('T')) {
      startDate += 'T00:00';
    }
    let endDate = this.props.startEnd.end && this.props.startEnd.end.format()
    if (endDate && !endDate.includes('T')) {
      endDate += 'T00:00';
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
        onEnter={this.handleEnter}
      >
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <IconButton color="inherit" className="event close-button" onClick={this.props.onClose} aria-label="Close">
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
              onChange: this.handleChange
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
              defaultValue: startDate
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
              defaultValue: endDate
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
            onClick={this.handleAddEvent}
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
