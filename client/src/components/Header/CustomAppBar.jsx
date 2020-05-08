import React, { useReducer } from "react";
import { connect } from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// import Hidden from "@material-ui/core/Hidden";
// // @material-ui/icons
// import Person from "@material-ui/icons/Person";
// import PersonAdd from "@material-ui/icons/PersonAdd";
// import ExitToApp from "@material-ui/icons/ExitToApp";
// // core components
// import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";

import { logout } from "../../actions/account";

class CustomAppBar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleClose = () => {
    this.setState({anchorEl:null});
  };

  handleOnProfileClick = () => {
    this.handleClose()
    this.props.openMemberDialog();
  }

  handleOnVisitorClick = () => {
    this.handleClose()
    this.props.openNewMemberDialog();
  }

  render() {
    const open = Boolean(this.state.anchorEl);

    const handleMenu = (event) => {
      this.setState({anchorEl: event.currentTarget});
    };

    const {title, name} = this.props;

    return (
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: '1'}}>
          {'JadeSoft >'}
          &nbsp;<strong>{title}</strong>
          </Typography>
          <br />
          <Typography variant="h6" noWrap>
          {'Welcome'}
          &nbsp;<strong>{name}</strong>
          </Typography>
          <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleOnProfileClick}>My Profile</MenuItem>
                <MenuItem onClick={this.handleOnVisitorClick}>Add Visitor</MenuItem>
                <MenuItem onClick={this.props.logout}>Logout</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(
  ({ account }) => ({ account }), 
  { logout }
)(withStyles(headerLinksStyle)(CustomAppBar));
