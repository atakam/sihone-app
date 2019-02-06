import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import Button from "components/CustomButtons/Button.jsx";

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import './Events.css'
import Add from "@material-ui/icons/Add";
import IconButton from '@material-ui/core/IconButton';
import AddCalendarDialog from './AddCalendarDialog'
import AddEventDialog from './AddEventDialog'
import AddEventFullScreenDialog from './AddEventFullScreenDialog'

import ApiCalendar from 'react-google-calendar-api';

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddCalendar: false,
      openAddEvent: false,
      openAddEventFullScreen: false,
      startValue: null,
      endValue: null,

      sign: ApiCalendar.sign
    };

    ApiCalendar.onLoad(() => {
        ApiCalendar.listenSign(this.signUpdate);
    });
  }

  signUpdate = (sign) => {
    this.setState({
      sign
    })
  }

  handleClickOpenAddCalendar = () => {
    this.setState({ openAddCalendar: true });
  };

  handleCloseAddCalendar = () => {
    this.setState({ openAddCalendar: false });
  };

  handleClickOpenAddEvent = () => {
    this.setState({ openAddEvent: true });
  };

  handleCloseAddEvent = () => {
    this.setState({ openAddEvent: false });
  };

  handleClickOpenAddEventFullScrenn = () => {
    this.setState({ openAddEventFullScreen: true });
  };

  handleCloseAddEventEventFullScreen = () => {
    this.setState({ openAddEventFullScreen: false });
  };

  componentDidMount () {
    this.initCalendar();
  }

  componentDidUpdate () {
    this.initCalendar();
  }

  initCalendar = () => {
    let that = this
    $('#agenda').fullCalendar({
      defaultView: 'agendaWeek',
      selectable: true,
      selectHelper: true,
      select: function(startDate, endDate) {
        that.initStartEndTime(startDate, endDate);
        that.handleClickOpenAddEvent();
      },
      dayClick: function() {}
    });
    $('#calendar').fullCalendar({
      height: 350
    });
  }

  initStartEndTime = (startDate, endDate) => {
    this.setState({
      startValue: startDate,
      endValue: endDate
    })
  }

  render() {
    return (
      <div id='events'>
        <div id='right-sidebar' className='left'>
          <div id='calendar'></div>
          <div className='clear'/>
          
        </div>
        <div id='main-view' className='right'>
          <div id='agenda'></div>
        </div>
        {
          this.state.sign ? (
            <Button color="" onClick={() => {ApiCalendar.handleSignoutClick();}}>Sign out</Button>
          ) : (
            <Button color="danger" onClick={() => {ApiCalendar.handleAuthClick();}}>Sign in with Google</Button>
          )
        }
        h: {this.state.sign}

        <AddCalendarDialog open={this.state.openAddCalendar} onClose={this.handleCloseAddCalendar}/>
        <AddEventDialog
          open={this.state.openAddEvent}
          onClose={this.handleCloseAddEvent}
          startEnd={{
            start: this.state.startValue,
            end: this.state.endValue
          }}
          openFullScreen={this.handleClickOpenAddEventFullScrenn}
        />
        <AddEventFullScreenDialog
          open={this.state.openAddEventFullScreen}
          onClose={this.handleCloseAddEventEventFullScreen}
          startEnd={{
            start: this.state.startValue,
            end: this.state.endValue
          }}
        />
      </div>
    );
  }
}

Events.propTypes = {
  classes: PropTypes.object
};

export default withStyles(dashboardStyle)(Events);
