import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';

import CreateMember from './CreateMember.jsx'

import ToolBar from "components/ToolBar/ToolBar.jsx";

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

class MemberView extends React.Component {
  static defaultProps = {
    title: "Edit Member"
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
          title={this.props.title}
        />
        <DialogContent>
          <CreateMember memberId={this.props.memberId} onClose={this.props.onClose} />
        </DialogContent>
      </Dialog>
    );
  }
}

MemberView.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  memberId: PropTypes.number.isRequired
};

export default withStyles(styles)(MemberView);
