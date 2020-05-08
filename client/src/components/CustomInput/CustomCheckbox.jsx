import React from "react";
// @material-ui/core components
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';

class CustomCheckbox extends React.Component {
  render () {
    return (
      <Checkbox
        {...this.props}
        classes={{checked: 'mui-checked'}}
        checkedIcon={<CheckBoxOutlinedIcon/>}
      />
    );
  }
}

export default CustomCheckbox
