import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class ToolBar extends React.Component {

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            {this.props.title}
          </Typography>
          <div className="toolbar-icons">
            {this.props.toolBarIcons}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

ToolBar.propTypes = {
  title: PropTypes.string,
  toolBarIcons: PropTypes.node
};

export default ToolBar;
