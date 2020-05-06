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

  handleClickOpenAddEvent = () => {
    this.setState({ openAddEvent: true });
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
      this.setState({events});
    });
  }

  handleClickEditFullScreen = (event) => {
    this.setState({
      eventValue: event.title,
      startValue: event.start,
      endValue: event.end || event.start,
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
    return (
      <div>
        <Card>
          <CardHeader color={'danger'}>
            <h4 className={classes.cardTitleWhite}>Calendar <a href='/events' style={{color: '#fff'}}>(View Events)</a></h4>
          </CardHeader>
          <CardBody style={{height: '600px'}}>
          <Calendar
            selectable
            localizer={localizer}
            events={this.state.events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
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

export default connect(
  ({ account }) => ({ account }),
  null
)( withStyles(dashboardStyle)(Events) );
