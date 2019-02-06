import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {

  render() {
    const {
      open,
      onClose,
      dialogTitle,
      dialogContent,
      onAccept,
      onDecline,
      acceptLabel,
      declineLabel
    } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDecline} color="primary">
            {declineLabel}
          </Button>
          <Button onClick={onAccept} color="primary" autoFocus>
            {acceptLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AlertDialog.propTypes = {
  open: PropTypes.bool,
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
  onClose: PropTypes.func,
  dialogTitle: PropTypes.string,
  dialogContent: PropTypes.string,
  acceptLabel: PropTypes.string,
  declineLabel: PropTypes.string
};

export default AlertDialog;