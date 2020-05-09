import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import AddEventDialog from './AddEventDialog'
import AddEventFullScreenDialog from './AddEventFullScreenDialog'

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";

import Utils from "../utils/Utils";

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

      events: [],

      allDay: false,
      eventId: null
    };

  }

  handleClickOpenAddEvent = (event) => {
    let start = Utils.getDateString(event.start, true);
    start = start.split(":")[0] + ":" + start.split(":")[1];
    let end = Utils.getDateString(event.end, true);
    end = end.split(":")[0] + ":" + end.split(":")[1];
    this.setState({
      openAddEvent: true,
      startValue: start,
      endValue: end
    });
  };

  handleCloseAddEvent = () => {
    this.setState({
      openAddEvent: false
    });
  };

  handleClickOpenAddEventFullScrenn = (event) => {
    this.setState({
      openAddEventFullScreen: true,
      eventValue: event.eventValue,
      startValue: event.startDate,
      endValue: event.endDate
    });
  };

  handleCloseAddEventEventFullScreen = () => {
    this.setState({ openAddEventFullScreen: false });
    this.fetchEvents();
  };

  componentDidMount () {
    this.fetchEvents();
  }

  fetchEvents = () => {
    Utils.fetchEvents(fetch).then((events) => {
      events['allDay?'] = events.allDay ? true : false;

      events = events.concat(this.generateReccuring(events));
      this.setState({events});
    });
  }

  generateReccuring = (events) => {
    
    const gevents = [];
    events.map((event) => {
      if (event.repeat === "daily" ||
      event.repeat === "weekly" ||
      event.repeat === "biweekly" ||
      event.repeat === "monthly" ||
      event.repeat === "yearly") {
        for (let i=0; i<1000; i++){
          const newEvent = JSON.parse(JSON.stringify(event));
          let start = new Date(newEvent.start);
          let end = new Date(newEvent.end);
          if (event.repeat === "daily") {
            start.setDate(start.getDate() + (i+1));
            end.setDate(end.getDate() + (i+1));
          }
          else if (event.repeat === "weekly") {
            start.setDate(start.getDate() + 7*(i+1));
            end.setDate(end.getDate() + 7*(i+1));
          }
          else if (event.repeat === "biweekly") {
            start.setDate(start.getDate() + 14*(i+1));
            end.setDate(end.getDate() + 14*(i+1));
          }
          else if (event.repeat === "monthly") {
            start.setMonth(start.getMonth() + (i+1));
            end.setMonth(end.getMonth() + (i+1));
          }
          else if (event.repeat === "yearly") {
            start.setFullYear(start.getFullYear() + (i+1));
            end.setFullYear(end.getFullYear() + (i+1));
          }
          
          newEvent.start = Utils.getDateString(start, true).split(":00 GMT")[0];
          newEvent.end = Utils.getDateString(end, true).split(":00 GMT")[0];
          gevents.push(newEvent);
        }
      }
      
    });
    return gevents;
  }

  handleClickEditFullScreen = (event) => {
    let start = Utils.getDateString(event.start, true);
    start = start.split(":")[0] + ":" + start.split(":")[1];
    let end = Utils.getDateString(event.end, true);
    end = end.split(":")[0] + ":" + end.split(":")[1];
    this.setState({
      eventValue: event.title,
      startValue: start,
      endValue: end || start,
      eventId: event.id,
      location: event.location,
      repeat: event.repeat,
      guests: event.guests || [],
      groups: event.groups || [],
      allDay: event.allDay,
      openAddEventFullScreen: true
    })
  }

  initStartEndTime = (startDate, endDate) => {
    this.setState({
      startValue: startDate.format(),
      endValue: endDate.format()
    })
  }

  render() {
    const {classes} = this.props;
    const localizer = momentLocalizer(moment);
    const hasAccess = (this.props.account.role === 'administrator' || 
      this.props.account.role === 'assistant' ||
      this.props.account.role === 'accountant');
    const events = this.state.events.map((ev) => {
      ev.start = new Date(ev.start);
      ev.end = new Date(ev.end);
      return ev;
    });
    return (
      <div>
        <Card>
          <CardHeader color={'danger'}>
            <h4 className={classes.cardTitleWhite}>Calendar <a href='/events' style={{color: '#fff'}}>(View Events)</a></h4>
          </CardHeader>
          <CardBody style={{height: '600px'}}>
          <Calendar
            selectable={hasAccess}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            defaultView={Views.WEEK}
            onSelectEvent={event => this.handleClickEditFullScreen(event)}
            onSelectSlot={this.handleClickOpenAddEvent}
          />
          </CardBody>
        </Card>
        
        <AddEventDialog
          open={this.state.openAddEvent}
          onClose={this.handleCloseAddEvent}
          start={this.state.startValue}
          end={this.state.endValue}
          openFullScreen={this.handleClickOpenAddEventFullScrenn}
          refresh={this.fetchEvents}
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
          refresh={this.fetchEvents}
        />
      </div>
    );
  }
}

Events.propTypes = {
  classes: PropTypes.object
};

export default connect(
  ({ account }) => ({ account }),
  null
)( withStyles(dashboardStyle)(Events) );
