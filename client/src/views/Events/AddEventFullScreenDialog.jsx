import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import Save from "@material-ui/icons/Save";
import Delete from "@material-ui/icons/Delete";
import CloseIcon from '@material-ui/icons/Close';

import CustomInput from "components/CustomInput/CustomInput.jsx";
import ToolBar from "components/ToolBar/ToolBar.jsx";

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
      repeat: 0,
      tabValue: 'details'
    };
  }

  handleAddEvent = () => {
    this.props.onClose && this.props.onClose();
  }

  handleRepeatChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  render() {
    let startDate = this.props.startEnd.start && this.props.startEnd.start.format()
    if (startDate && !startDate.includes('T')) {
      startDate += 'T00:00';
    }
    let endDate = this.props.startEnd.end && this.props.startEnd.end.format()
    if (endDate && !endDate.includes('T')) {
      endDate += 'T00:00';
    }

    const toolBarIcons = (
      <span>
        <Tooltip title="Delete">
          <IconButton
            onClick={this.handleMenu}
            color="inherit"
          >
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save">
          <IconButton
            onClick={this.handleMenu}
            color="inherit"
          >
            <Save />
          </IconButton>
        </Tooltip>
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
          <CustomInput
            labelText={this.props.eventLabel}
            id="name"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              autoFocus: true
            }}
          />
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
          <Checkbox /> All day
          <Select
            value={this.state.repeat}
            onChange={this.handleRepeatChange}
            inputProps={{
              name: 'repeat',
              id: 'repeat',
            }}
            className="repeat-select"
          >
            <MenuItem value={0}>Does Not repeat</MenuItem>
            <MenuItem value={1}>Daily</MenuItem>
            <MenuItem value={2}>Weekly</MenuItem>
            <MenuItem value={3}>Bi Weekly</MenuItem>
            <MenuItem value={4}>Monthly</MenuItem>
            <MenuItem value={5}>Yearly</MenuItem>
          </Select>
          <div className="clear" />
          <Tabs
            className='event-tabs'
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            indicatorColor="primary"
          >
            <Tab
              value='details'
              disableRipple
              label="EVENT DETAILS"
            />
            <Tab
              value='guests'
              disableRipple
              label="GUESTS"
            />
          </Tabs>
          {this.state.tabValue === 'details' && <TabContainer>
            <CustomInput
              labelText={'Location'}
              id="location"
              formControlProps={{
                fullWidth: true
              }}
            />
            <CustomInput
              labelText={'Event Description'}
              id="description"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                multiline: true
              }}
            />
          </TabContainer>}
          {this.state.tabValue === 'guests' && <TabContainer>
            <CustomInput
              labelText={'Add Guest (Group name or member name)'}
              id="add-guest"
              formControlProps={{
                fullWidth: true
              }}
            />
            <div>
              <p>
                <IconButton color="inherit" aria-label="Delete">
                  <CloseIcon />
                </IconButton>
                Guest 1
              </p>
              <p>
                <IconButton color="inherit" aria-label="Delete">
                  <CloseIcon />
                </IconButton>
                Guest 2
              </p>
              <p>
                <IconButton color="inherit" aria-label="Delete">
                  <CloseIcon />
                </IconButton>
                Guest 3
              </p>
            </div>
          </TabContainer>}
          <div className="clear" />
        </DialogContent>
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
  startEnd: PropTypes.object
};

export default withStyles(styles)(AddEventFullScreenDialog);
