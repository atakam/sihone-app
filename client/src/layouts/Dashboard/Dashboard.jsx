/* eslint-disable */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo_light.png";

import Person from "@material-ui/icons/Person";
import Accessibility from "@material-ui/icons/Accessibility";
import Group from "@material-ui/icons/Group";
import SupervisorAccount from "@material-ui/icons/SupervisorAccount";
import AccessTime from "@material-ui/icons/AccessTime";

import Login from "../Login/Login.jsx";
import MemberView from "../../views/Members/MemberView.jsx";

import VisitorForm from "../../views/Members/VisitorForm.jsx";
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';

import ToolBar from "components/ToolBar/ToolBar.jsx";

const topData = [
  {
    title: 'Total Members',
    value: '300',
    icon: <Person />,
    caption: 'View All Members',
    captionLink: '/members',
    captionIcon: <Person />,
    colorValue: 'warning',
    key: 'members'
  },
  {
    title: 'Total Families',
    value: '300',
    icon: <SupervisorAccount />,
    caption: 'View All Families',
    captionLink: '/members?view=families',
    captionIcon: <SupervisorAccount />,
    colorValue: 'success',
    key: 'families'
  },
  {
    title: 'Total Children',
    value: '100',
    icon: <Accessibility />,
    caption: 'View All Children',
    captionLink: '/members?view=children',
    captionIcon: <Accessibility />,
    colorValue: 'danger',
    key: 'children'
  },
  {
    title: 'Total Groups',
    value: '5',
    icon: <Group />,
    caption: 'View All Groups',
    captionLink: '/groups',
    captionIcon: <Group />,
    colorValue: 'info',
    key: 'groups'
  }
];

const charts = [
  {
    title: new Date().getFullYear() + ' Donations',
    subtitle1: 'Monthly Breakdown',
    subtitle2: new Date().getFullYear(),
    subicon: <AccessTime />,
    data: {
      labels: [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D"
      ],
      series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
    },
    options: {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 0,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    },
    responsiveOptions: [
      [
        "screen and (max-width: 640px)",
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }
      ]
    ],
    animation: {
      draw: function(data) {
        if (data.type === "bar") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * 80,
              dur: 500,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        }
      }
    },
    colorValue: 'info'
  }
];

const lists = [
  {
    title: 'Upcoming Events',
    subtitle: <a href="/events">See all Events</a>,
    headers: [
      'Event Name',
      'Start Time',
      'End Time',
      'Location',
      'All Day'
    ],
    data: [
      [0,<a href="/events">Event 1</a>, 'Start time 1', 'End time 1', 'Location 1', 'Yes'],
      [1,<a href="/events">Event 2</a>, 'Start time 2', 'End time 2', 'Location 2', 'No'],
      [2,<a href="/events">Event 3</a>, 'Start time 3', 'End time 3', 'Location 3', 'Yes']
    ],
    colorValue: 'danger'
  }
]

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      let newComponent = prop.component;
      switch (prop.navbarName) {
        case 'Home':
          newComponent = React.cloneElement(prop.component, {
            topData: topData,
            charts: charts,
            lists: lists
          });
          return <Route path={prop.path} render={() => {return newComponent}} key={key} />;
        default:
          return <Route path={prop.path} component={prop.component} key={key} />
      }
    })}
  </Switch>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps";
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      //const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  openMemberDialog = () => {
    this.setState({ openMemberDialog: true });
  }

  closeMemberDialog = () => {
    this.setState({ openMemberDialog: false });
  }

  openNewMemberDialog = () => {
    this.setState({ openNewMemberDialog: true });
  }

  closeNewMemberDialog = () => {
    this.setState({ openNewMemberDialog: false });
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      this.props.account.loggedIn ? (
        <div className={classes.wrapper}>
          <Sidebar
            routes={dashboardRoutes}
            logoText={"JadeSoft"}
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            role={this.props.account.role}
            classes={
              {itemLink: 'menu-item'}
            }
            {...rest}
          />
          <div className={classes.mainPanel} ref="mainPanel">
            <Header
              routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              openMemberDialog={this.openMemberDialog}
              openNewMemberDialog={this.openNewMemberDialog}
              name={this.props.account.firstname}
              {...rest}
            />
            {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
            {this.getRoute() ? (
              <div className={classes.content}>
                <div className={classes.container}>{switchRoutes}</div>
              </div>
            ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
            {this.getRoute() ? <Footer /> : null}
          </div>
          <MemberView
            open={this.state.openMemberDialog}
            onClose={this.closeMemberDialog}
            memberId={this.props.account.memberid}
          />
          <Dialog
            fullScreen
            open={this.state.openNewMemberDialog}
            onClose={this.closeNewMemberDialog}
          >
            <ToolBar
              toolBarIcons={
                <span>
                  <Tooltip title="Cancel">
                    <IconButton color="inherit" onClick={this.closeNewMemberDialog} aria-label="Close">
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </span>
              }
              title={'New Visitor Entry'}
            />
            <DialogContent>
              <VisitorForm onClose={this.closeNewMemberDialog} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (<Login />)
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  ({ account }) => ({ account }),
  null
)( withStyles(dashboardStyle)(App));
