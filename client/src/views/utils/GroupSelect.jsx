import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class GroupSelect extends React.Component {
  state = {
    groups: []
  };

  static defaultProps = {
    placeholder: 'Search'
  }

  componentDidMount () {
    setTimeout(() => this.fetchGroups(), 1000);
  }

  fetchGroups = () => {
    let url = '/group/findAll';
    if (this.props.emailOnly) {
      url = '/group/findAllWithEmails';
    }
    fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        groups: json.groups
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    const { classes, theme, onChange, value, excludeGroups } = this.props;

    const excludes = excludeGroups.map((group) => group.id);

    let suggestions = this.state.groups.map(group => {
      if (excludes.indexOf(group.id) < 0) {
        return {
          id: group.id,
          value: group.id,
          label: group.groupname,
        };
      }
      return null;
    });

    suggestions = suggestions.filter((obj) => obj );

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
      }),
    };

    return (
      <Select
        classes={classes}
        styles={selectStyles}
        options={suggestions}
        components={components}
        value={value}
        onChange={onChange}
        placeholder={this.props.placeholder}
        className={'member-select'}
      />
    );
  }
}

GroupSelect.defaultProps = {
  excludeGroups: []
};

GroupSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  excludeGroups: PropTypes.arrayOf(PropTypes.object),
  emailOnly: PropTypes.bool
};

export default withStyles(styles, { withTheme: true })(GroupSelect);
