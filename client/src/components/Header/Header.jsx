import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import CustomAppBar from "./CustomAppBar";

import headerStyle from "assets/jss/material-dashboard-react/components/headerStyle.jsx";

function Header({ ...props }) {
  function makeBrand() {
    var name;
    props.routes.map((prop, key) => {
      if (prop.path === props.location.pathname) {
        name = prop.navbarName;
      }
      return null;
    });
    return name;
  }
  const { classes, color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  return (
    <CustomAppBar
      title={makeBrand()}
      name={props.name}
      openMemberDialog={props.openMemberDialog}
      openNewMemberDialog={props.openNewMemberDialog}
    />
    // <AppBar className={classes.appBar + appBarClasses}>
    //   <Toolbar className={classes.container}>
    //     <div className={classes.flex}>
    //       {/* Here we create navbar brand, based on route name */}
    //       <Button color="transparent" href="#" className={classes.title}>
    //         {'JadeSoft > '}
    //         <strong>&nbsp;{makeBrand()}</strong>
    //       </Button>
    //     </div>
    //     <Hidden smDown implementation="css">
    //       <CustomAppBar
    //         name={props.name}
    //         openMemberDialog={props.openMemberDialog}
    //         openNewMemberDialog={props.openNewMemberDialog}
    //       />
    //     </Hidden>
    //     <Hidden mdUp implementation="css">
    //       <IconButton
    //         color="inherit"
    //         aria-label="open drawer"
    //         onClick={props.handleDrawerToggle}
    //       >
    //         <Menu />
    //       </IconButton>
    //     </Hidden>
    //   </Toolbar>
    // </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  openMemberDialog: PropTypes.func,
  openNewMemberDialog: PropTypes.func
};

export default withStyles(headerStyle)(Header);
