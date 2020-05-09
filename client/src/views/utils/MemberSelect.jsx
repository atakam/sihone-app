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

class MemberSelect extends React.Component {
  state = {
    members: []
  };

  static defaultProps = {
    placeholder: 'Search'
  }

  componentDidMount () {
    this.fetchMembers();
  }

  fetchMembers = () => {
    fetch('/member/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        members: json.members
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    const { classes, theme, onChange, value, excludeMembers, showId } = this.props;

    const excludes = excludeMembers.map((member) => member.id);

    let suggestions = this.state.members.map(member => {
      const idLabel = showId ? " (" + member.memberuid + ")" : '';
      if (excludes.indexOf(member.id) < 0) {
        return {
          id: member.id,
          value: member.id,
          label: member.firstname + ' ' + member.lastname + idLabel,
          firstname: member.firstname,
          lastname: member.lastname,
          email: member.email,
          subscribtion: member.subscribtion,
          phone: member.phone,
          streetaddress: member.streetaddress,
          city: member.city,
          province: member.province,
          postalcode: member.postalcode,
          country: member.country
        };
      }
      return null;
    });
    suggestions = suggestions.filter((obj) => obj );

    if (this.props.emailOnly) {
      suggestions = suggestions.map(member => {
        const idLabel = showId ? " (" + member.memberuid + ")" : '';
        //console.log("MEMBER", member);
        if (member.email && member.subscribtion) {
          return {
            id: member.id,
            value: member.value,
            label: member.firstname + ' ' + member.lastname + idLabel,
            firstname: member.firstname,
            lastname: member.lastname,
            email: member.email,
            phone: member.phone,
            streetaddress: member.streetaddress,
            city: member.city,
            province: member.province,
            postalcode: member.postalcode,
            country: member.country
          }
        }
        return null;
      });
    }
    suggestions = suggestions.filter((obj) => obj );

    if (this.props.phoneOnly) {
      suggestions = suggestions.map(member => {
        const idLabel = showId ? " (" + member.memberuid + ")" : '';
        if (member.phone) {
          return {
            id: member.id,
            value: member.value,
            label: member.firstname + ' ' + member.lastname + idLabel,
            firstname: member.firstname,
            lastname: member.lastname,
            email: member.email,
            phone: member.phone,
            streetaddress: member.streetaddress,
            city: member.city,
            province: member.province,
            postalcode: member.postalcode,
            country: member.country
          };
        }
        return null;
      });
    }
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

MemberSelect.defaultProps = {
  excludeMembers: []
};

MemberSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  excludeMembers: PropTypes.arrayOf(PropTypes.object),
  emailOnly: PropTypes.bool,
  phoneOnly: PropTypes.bool,
  showId: PropTypes.bool
};

export default withStyles(styles, { withTheme: true })(MemberSelect);
