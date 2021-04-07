import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import LiveTvIcon from '@material-ui/icons/LiveTv';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Youtube from './Youtube';
import Facebook from './Facebook';

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import "react-big-calendar/lib/css/react-big-calendar.css";

class LiveStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'youtube',
      youtube: '',
      facebook: ''
    };
  }

  getTabs = () => {
    return (
      <Tabs
        className='menu-tabs'
        value={this.state.tabValue}
        onChange={this.handleTabChange}
        scrollable
        scrollButtons="on"
        classes={
          {indicator: 'tabs-indicator'}
        }
      >
        <Tab
          value='youtube'
          disableRipple
          label="YOUTUBE LIVE"
          icon={<LiveTvIcon />}
        />
        <Tab
          value='facebook'
          disableRipple
          label="FACEBOOK LIVE"
          icon={<LiveTvIcon />}
        />
      </Tabs>
    );
  }

  componentDidMount () {
    this.fetchSettings();
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        youtube: json.settings.youtube && json.settings.youtube !== '' ? json.settings.youtube : 'https://www.youtube.com/embed/Snr_eId97YM',
        facebook: json.settings.facebook && json.settings.facebook !== '' ? json.settings.facebook : 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FSihoneDesign%2Fposts%2F1009169426167415'
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    return (
      <div>
        {this.state.tabValue === 'youtube' && <Youtube tabs={this.getTabs()} url={this.state.youtube} />}
        {this.state.tabValue === 'facebook' && <Facebook tabs={this.getTabs()} url={this.state.facebook} />}
      </div>
    );
  }
}

LiveStream.propTypes = {
  classes: PropTypes.object
};

export default connect(
  ({ account }) => ({ account }),
  null
)( withStyles(dashboardStyle)(LiveStream) );
