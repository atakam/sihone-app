import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';

import DonationsList from './DonationsList.jsx'

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AddDonation extends React.Component {
  static defaultProps = {
    title: "Edit Envelope"
  }

  constructor(props) {
    super(props);
    this.state = {
      envelopes: [],
    };
  }

  render() {
    const toolBarIcons = (
      <span>
        <Tooltip title="Cancel">
          <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </span>
    );

    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.props.onClose}
        TransitionComponent={Transition}
        className="full-screen-dialog"
      >
        <ToolBar
          toolBarIcons={toolBarIcons}
          title={'Make a Donation'}
        />
        <DialogContent>
          <DonationsList
            envelopeId={this.props.envelopeId}
            envelopeDate={this.state.envelopedate}
            memberId={this.props.memberId}
            onClose={this.props.onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

AddDonation.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  envelopeId: PropTypes.number
};

export default withStyles(styles)(AddDonation);
