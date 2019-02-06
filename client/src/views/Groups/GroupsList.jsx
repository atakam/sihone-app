import React from "react";
import PropTypes from "prop-types";
import CONFIG from "../../configs";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import GroupView from './GroupView.jsx';

import Utils from "../utils/Utils";

class GroupsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openGroup: 0,
      groups: []
    };
  }

  onRowClick = (groupId) => {
    this.setState({ openGroup: groupId });
  };

  onEdit = (id) => {
      
  }

  handleCloseGroup = () => {
    this.setState({ openGroup: 0 });
    this.fetchGroups();
  }

  componentDidMount () {
    this.fetchGroups();
  }

  fetchGroups = () => {
    fetch(CONFIG.serverUrl+'/group/findAll')
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
    return (
      <GridContainer>
        Count: {this.state.groups.length}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <CustomInput
                labelText={'Search groups name or type'}
                id="search-groups"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  autoFocus: true,
                  onKeyUp: (event) => Utils.searchTable(event.target, 'groups-table')
                }}
              />
              <Table
                id={'groups-table'}
                tableHeaderColor="primary"
                tableHead={["Name", "Type", "Count"]}
                tableData={
                  this.state.groups.map(
                    (group, index) => {
                      return (
                        [group.id, group.groupname, group.grouptype, group.count]
                      )
                    }
                  )
                }
                onRowClick={this.onRowClick}
                onRowMouseOver={this.onRowMouseOver}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GroupView
          open={this.state.openGroup > 0}
          onClose={this.handleCloseGroup}
          groupId={this.state.openGroup}
        />
      </GridContainer>
    )
  }
}

GroupsList.propTypes = {
  isChildren: PropTypes.bool
};

export default GroupsList;
