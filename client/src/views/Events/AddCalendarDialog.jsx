import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import validator from 'validator';

export default class AddCalendarDialog extends React.Component {
  static defaultProps = {
    title: "Add Calendar URL",
    subtitle: "You can add a calendar using the iCal format by its address.",
    cancelLabel: "CANCEL",
    addLabel: "ADD CALENDAR",
    urlLabel: "URL"
  }

  constructor(props) {
    super(props);
    this.state = {
      urlValue: ''
    };
  }

  handleAddURL = () => {
    this.props.onClose && this.props.onClose();
  }

  handleChange = (event) => {
    this.setState({urlValue: event.target.value})
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={this.props.urlLabel}
            type="text"
            fullWidth
            onChange={this.handleChange}
          />
          <DialogContentText>
            {this.props.subtitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
            {this.props.cancelLabel}
          </Button>
          <Button
            onClick={this.handleAddURL}
            color="primary"
            disabled={!this.state.urlValue
              || this.state.urlValue.length === 0
              || !validator.isURL(this.state.urlValue)}
          >
            {this.props.addLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddCalendarDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  urlLabel: PropTypes.string,
  addLabel: PropTypes.string,
  cancelLabel: PropTypes.string
};
