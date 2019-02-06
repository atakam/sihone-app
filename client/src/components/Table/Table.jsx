import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle";
import { Checkbox } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

class CustomTable extends React.Component {

  constructor(props) {
    super(props);

    let checkboxes = props.tableData.map((data) => {
      return false;
    });
    this.state = {
      checkboxes: checkboxes
    };
  }

  static getDerivedStateFromProps(props, state) {
    let checkboxes = props.tableData.map((data, i) => {
      return state.checkboxes ? state.checkboxes[i] : false;
    });
    return {
      checkboxes: checkboxes
    }
  }

  toggleSelectAll = (event, checked) => {
    const old_checkboxes = this.state.checkboxes;
    let checkboxes = old_checkboxes.map((d, i) => {
      return checked;
    });
    this.setState({
      checkboxes: checkboxes
    })
  }

  onCheckboxChange = (e, checked, index) => {
    let checkboxes = this.state.checkboxes;
    checkboxes[index] = checked;
    this.setState({
      checkboxes: checkboxes
    })
  }

  onCheckboxClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {
      id,
      classes,
      tableHead,
      tableData,
      tableHeaderColor,
      rowClassName,
      onRowClick,
      useCheckbox,
      rowActions
    } = this.props;

    const {
      checkboxes
    } = this.state;
    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table} id={id}>
          {tableHead !== undefined ? (
            <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
              <TableRow className={'table-header'}>
                {
                  useCheckbox ? (
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell + " checkbox-cell"}>
                      <Checkbox onChange={this.toggleSelectAll} />
                    </TableCell>
                  ) : null
                }
                {tableHead.map((prop, key) => {
                  return (
                    <TableCell
                      className={classes.tableCell + " " + classes.tableHeadCell}
                      key={key}
                    >
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {tableData.map((props, key) => {
              const isChecked = checkboxes[key];
              let checkbox = null;
              if (isChecked)
                checkbox = <Checkbox onChange={(e, checked)=>this.onCheckboxChange(e, checked, key)} checked />;
              else
                checkbox = <Checkbox onChange={(e, checked)=>this.onCheckboxChange(e, checked, key)} />;
              return (
                <TableRow
                  key={key}
                  className={rowClassName || 'table-row'}
                >
                  {
                    useCheckbox ? (
                      <TableCell className={classes.tableCell} key={key}>
                        {checkbox}
                      </TableCell>
                    ) : null
                  }
                  {props.map((prop, key) => {
                    if (key === 0) return null;
                    return (
                      <TableCell className={classes.tableCell} key={key} onClick={() => onRowClick(props[0])}>
                        {prop}
                      </TableCell>
                    );
                  })}
                  {
                    rowActions.map((action, key) => {
                      const callback = () => action.action(props[0]);
                      let icon = null;
                      if (action.type === 'delete') {
                        icon = <DeleteIcon />
                      } else if (action.type === 'edit') {
                        icon = <EditIcon />
                      }
                      return (<TableCell className={classes.tableCell} key={key}>
                        <IconButton className={classes.button} aria-label={action.label} onClick={callback}>
                          {icon}
                        </IconButton>
                      </TableCell>)
                    })
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
  onRowClick: () => {},
  rowActions: []
};

CustomTable.propTypes = {
  id: PropTypes.string,
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.node),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
  rowClassName: PropTypes.string,
  onRowClick: PropTypes.func,
  useCheckbox: PropTypes.bool,
  rowActions: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(tableStyle)(CustomTable);
