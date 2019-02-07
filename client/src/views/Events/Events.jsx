import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import './Events.css';
import AddCalendarDialog from './AddCalendarDialog'
import AddEventDialog from './AddEventDialog'
import AddEventFullScreenDialog from './AddEventFullScreenDialog'

// import ApiCalendar from 'react-google-calendar-api';

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddCalendar: false,
      openAddEvent: false,
      openAddEventFullScreen: false,
      eventValue: '',
      startValue: null,
      endValue: null,

      sign: null,

      events: [],

      allDay: false,
      eventId: null
    };

    // ApiCalendar.onLoad(() => {
    //     ApiCalendar.listenSign(this.signUpdate);
    // });
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

  handleCloseAddEvent = (shouldRefresh) => {
    this.setState({
      openAddEvent: false
    });
    shouldRefresh && this.reset();
  };

  reset = () => {
    this.setState({
      openAddEvent: false,
      eventValue: '',
      startValue: '',
      endValue: '',
      allDay: false,
      eventId: null
    });
    this.fetchEvents(true);
  };

  handleClickOpenAddEventFullScrenn = (event) => {
    this.setState({
      openAddEventFullScreen: true,
      eventValue: event.eventValue,
      startValue: event.startDate,
      endValue: event.endDate
    });
  };

  handleCloseAddEventEventFullScreen = (shouldRefresh) => {
    this.setState({ openAddEventFullScreen: false });
    this.fetchEvents();
    shouldRefresh && this.reset();
  };

  fetchEvents = (shouldRefresh) => {
    fetch('/event/findAll')
    .then(response => response.json())
    .then(json => {
      //console.log('json', json);
      let eventids = [];
      let skippedids = [];
      let events = json.events.map((event, index) => {
        if (!eventids.includes(event.eventid)) {
          var d = new Date('2019-02-08T07:30:00');
          var n = d.getDay() -1;
          eventids.push(event.eventid);
          return {
            title: event.description,
            start: event.startdate,
            end: event.enddate,
            allDay: event.allday,
            id: event.eventid,
            location: event.location,
            repeat: event.repeat,
            daysOfWeek: event.repeat === 'daily' ? [0,1,2,3,4,5,6] : (event.repeat === 'weekly' ? [n] : null),
            startRecur: event.startdate,
            guests: event.memberid ? [{
              id: event.memberid,
              value: event.memberid,
              label: event.firstname + ' ' + event.lastname
            }] : [],
            groups: event.groupid ? [{
              id: event.groupid,
              value: event.groupid,
              label: event.groupname
            }] : []
          }
        } 
        else {
          skippedids.push(index);
        }
        return null;
      });
      events = events.filter(function (el) {
        return el != null;
      });
      
      events = events.map((event) => {
        skippedids.map((id, index) => {
          if (event.id === json.events[id].eventid) {
            const _e = json.events[id];
            _e.memberid && !this.propInArray(event.guests, _e.memberid) && event.guests.push({
              id: _e.memberid,
              value: _e.memberid,
              label: _e.firstname + ' ' + _e.lastname
            });
            _e.groupid && !this.propInArray(event.groups, _e.groupid) && event.groups.push({
              id: _e.groupid,
              value: _e.groupid,
              label: _e.groupname
            });
            skippedids.splice(index, 1);
          }
          return null;
        })
        return event;
      })

      events = events.filter(function (el) {
        return el != null;
      });

      this.setState({
        events
      }, this.initCalendar);

      console.log(events);

      shouldRefresh && window.location.reload();
    })
    .catch(error => console.log('error', error));
  }

  propInArray=(arr, prop)=> {
    let found = false;
    for(let i = 0; i < arr.length; i++) {
        if (arr[i].value === prop) {
            found = true;
            break;
        }
    }
    return found;
  }

  componentDidMount () {
    this.fetchEvents(false);
  }

  handleClickEditFullScreen = (event) => {
    this.setState({
      eventValue: event.title,
      startValue: event.start.format(),
      endValue: event.end ? event.end.format() : event.start.format(),
      eventId: event.id,
      location: event.location,
      repeat: event.repeat,
      guests: event.guests || [],
      groups: event.groups || [],
      allDay: event.allDay,
      openAddEventFullScreen: true
    })
  }

  initCalendar = () => {
    let that = this;
    $('#agenda').fullCalendar({
      defaultView: 'agendaWeek',
      selectable: true,
      selectHelper: true,
      select: function(startDate, endDate) {
        that.initStartEndTime(startDate, endDate);
        that.handleClickOpenAddEvent();
      },
      dayClick: function() {},
      events: that.state.events,
      eventClick: that.handleClickEditFullScreen
    });
    $('#calendar').fullCalendar({
      height: 350
    });
  }

  initStartEndTime = (startDate, endDate) => {
    this.setState({
      startValue: startDate.format(),
      endValue: endDate.format()
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
        <div className='clear'/>

        <AddCalendarDialog open={this.state.openAddCalendar} onClose={this.handleCloseAddCalendar}/>
        <AddEventDialog
          open={this.state.openAddEvent}
          onClose={this.handleCloseAddEvent}
          start={this.state.startValue}
          end={this.state.endValue}
          openFullScreen={this.handleClickOpenAddEventFullScrenn}
        />
        <AddEventFullScreenDialog
          open={this.state.openAddEventFullScreen}
          onClose={this.handleCloseAddEventEventFullScreen}
          eventValue={this.state.eventValue}
          start={this.state.startValue}
          end={this.state.endValue}
          eventId={this.state.eventId}
          allday={this.state.allDay}
          location={this.state.location}
          repeat={this.state.repeat}
          guests={this.state.guests}
          groups={this.state.groups}
        />
      </div>
    );
  }
}

Events.propTypes = {
  classes: PropTypes.object
};

export default withStyles(dashboardStyle)(Events);
