import React from "react";

import Button from "components/CustomButtons/Button.jsx";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


class Events extends React.Component {

  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (event, name) => {
  }

  render() {
    return (
        <div>
            <Button
                onClick={(e) => this.handleItemClick(e, 'sign-in')}
            >
            sign-in
            </Button>
            <Button
                onClick={(e) => this.handleItemClick(e, 'sign-out')}
            >
            sign-out
            </Button>
        </div>
    );
  }
}

export default withStyles(dashboardStyle)(Events);
