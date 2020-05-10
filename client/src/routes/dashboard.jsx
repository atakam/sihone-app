import React from "react";

// @material-ui/icons
import Home from "@material-ui/icons/Home";
import DateRange from "@material-ui/icons/DateRange";
import LiveTvIcon from '@material-ui/icons/LiveTv';
import Person from "@material-ui/icons/Person";
import Group from "@material-ui/icons/Group";
import AttachMoney from "@material-ui/icons/AttachMoney";
import Build from "@material-ui/icons/Build";
import Work from "@material-ui/icons/Work";
import Mail from "@material-ui/icons/Mail";
import Assignment from "@material-ui/icons/Assignment";
// import Activity from "@material-ui/icons/Notifications";
import ExitToApp from "@material-ui/icons/ExitToApp";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import EventsPage from "views/Events/Events.jsx";
import MembersPage from "views/Members/Members.jsx";
import GroupsPage from "views/Groups/Groups.jsx";
import DonationsPage from "views/Donations/Donations.jsx";
import AccountingPage from "views/Accounting/Accounting.jsx";
import MessagingPage from "views/Messaging/Messaging.jsx";
import LiveStreamPage from "views/LiveStream/LiveStream.jsx";
// import ActivityPage from "views/Activity/Activity.jsx";
import ReportingPage from "views/Reporting/Reporting.jsx";
import SettingsPage from "views/Settings/Settings.jsx";
import LogoutPage from "../layouts/Logout/Logout";

const dashboardPage = <DashboardPage />

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Home",
    navbarName: "Home",
    icon: Home,
    component: dashboardPage
  },
  {
    path: "/events",
    sidebarName: "Events",
    navbarName: "Events",
    icon: DateRange,
    component: EventsPage
  },
  {
    path: "/members",
    sidebarName: "Members",
    navbarName: "Members",
    icon: Person,
    component: MembersPage
  },
  {
    path: "/groups",
    sidebarName: "Groups",
    navbarName: "Groups",
    icon: Group,
    component: GroupsPage
  },
  {
    path: "/donations",
    sidebarName: "Donations",
    navbarName: "Donations",
    icon: AttachMoney,
    component: DonationsPage
  },
  {
    path: "/accounting",
    sidebarName: "Accounting",
    navbarName: "Accounting",
    icon: Work,
    component: AccountingPage
  },
  {
    path: "/messaging",
    sidebarName: "Messaging",
    navbarName: "Messaging",
    icon: Mail,
    component: MessagingPage
  },
  {
    path: "/stream",
    sidebarName: "Live Stream",
    navbarName: "Live Stream",
    icon: LiveTvIcon,
    component: LiveStreamPage
  },
  {
    path: "/reporting",
    sidebarName: "Reporting",
    navbarName: "Reporting",
    icon: Assignment,
    component: ReportingPage
  },
  // {
  //   path: "/activity",
  //   sidebarName: "Activity",
  //   navbarName: "Activity",
  //   icon: Activity,
  //   component: ActivityPage
  // },
  {
    path: "/settings",
    sidebarName: "Settings",
    navbarName: "Settings",
    icon: Build,
    component: SettingsPage
  },
  {
    path: "/logout",
    sidebarName: "Logout",
    navbarName: "Logout",
    icon: ExitToApp,
    component: LogoutPage
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
