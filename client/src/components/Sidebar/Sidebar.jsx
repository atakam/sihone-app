import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import Utils from "../../views/utils/Utils";

import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }

  function renderNavigation(key, prop) {
    const { classes, color } = props;
    if (prop.redirect) return null;
    var activePro = " ";
    var listItemClasses;
    if (prop.path === "/upgrade-to-pro") {
      activePro = classes.activePro + " ";
      listItemClasses = classNames({
        [" " + classes[color]]: true
      });
    } else {
      listItemClasses = classNames({
        [" " + classes[color]]: activeRoute(prop.path)
      });
    }
    const whiteFontClasses = classNames({
      [" " + classes.whiteFont]: activeRoute(prop.path)
    });
    return (
      <NavLink
        to={prop.path}
        className={activePro + classes.item}
        activeClassName="active"
        key={key}
      >
        <ListItem button className={classes.itemLink + listItemClasses}>
          <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
            {typeof prop.icon === "string" ? (
              <Icon>{prop.icon}</Icon>
            ) : (
              <prop.icon />
            )}
          </ListItemIcon>
          <ListItemText
            primary={prop.navbarName}
            className={classes.itemText + whiteFontClasses}
            disableTypography={true}
          />
        </ListItem>
      </NavLink>
    );
  }

  const { classes, logo, image, routes, role } = props;
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {

        // ADMINISTRATOR // ADMINISTRATIVE ASSISTANT // ACCOUNTANT
        if (Utils.isAdministrator(role) || Utils.isAdminAssistant(role) || Utils.isAccountant(role)) {
          switch(prop.navbarName) {
            case 'Home':
            case 'Events':
            case 'Members':
            case 'Groups':
            case 'Donations':
            case 'Accounting':
            case 'Messaging':
            case 'Live Stream':
            case 'Reporting':
            case 'Activity':
            case 'Settings':
            case 'Logout':
              return renderNavigation(key, prop);
            default:
              return null;
          }
        } 

        // GROUP ADMIN
        else if (Utils.isGroupAdministrator(role)) {
          switch(prop.navbarName) {
            case 'Home':
            case 'Events':
            case 'Members':
            case 'Donations':
            case 'Messaging':
            case 'Live Stream':
            case 'Settings':
            case 'Logout':
              return renderNavigation(key, prop);
            default:
              return null;
          }
        }

        // MEMBER / VISITOR
        else {
          switch(prop.navbarName) {
            case 'Home':
            case 'Events':
            case 'Live Stream':
            case 'Donations':
            case 'Logout':
              return renderNavigation(key, prop);
            default:
              return null;
          }
        }
      })}
      
    </List>
  );
  var brand = (
    <div className={classes.logo + " logo-div"}>
      <a href="/dashboard" className={classes.logoLink}>
        <img src={logo} alt="logo" className={classes.img + " logo"} />
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  role: PropTypes.string
};

export default withStyles(sidebarStyle)(Sidebar);
