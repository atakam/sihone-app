import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import FamilyView from './FamilyView'

class FamilyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openFamily: 0,
      families: []
    };
  }

  onEdit = (id) => {
      this.setState({ openFamily: id });
  }

  handleCloseFamily = () => {
    this.setState({ openFamily: 0 });
    this.fetchFamilies();
  }

  componentDidMount () {
    this.fetchFamilies();
  }

  fetchFamilies = () => {
    fetch('/family/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        families: json.families
      });
      this.props.refreshNumbers && this.props.refreshNumbers();
    })
    .catch(error => console.log('error', error));
  }

  render() {
    let skippedFamilies = [];
    let families = this.state.families;
    families.map((family, i) => {
      family.count = 1;
      families.map((family2, j) => {
        if (i < j && family.id === family2.id) {
          family.count++;
          skippedFamilies.push(j);
        }
        return null;
      })
      return null;
    });
    families = families.map((family, i) => {
      let found = false;
      skippedFamilies.map((j) => {
        if (i === j) {
          found = true;
        }
        return null;
      })
      return found ? null : family;
    });
    families = families.filter(function (el) {
      return el != null;
    });

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={'warning'}>
              {this.props.tabs}
            </CardHeader>
            <CardBody>
              <CustomInput
                labelText={'Search family name or address'}
                id="search-families"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  autoFocus: true
                }}
              />
              <Table
                tableHeaderColor="primary"
                tableHead={["Name", "Member Count", "Address"]}
                tableData={
                  families.map(
                    (family, index) => {
                      return (
                        [
                          family.id,
                          family.familyname,
                          family.count,
                          family.streetaddress + ' ' + family.city + ' ' + family.province + ' ' + family.postalcode + ' ' + family.country
                        ]
                      )
                    }
                  )
                }
                onRowClick={this.onEdit}
              />
            </CardBody>
          </Card>
        </GridItem>
        <FamilyView
          open={this.state.openFamily > 0}
          onClose={this.handleCloseFamily}
          familyId={this.state.openFamily}
        />
      </GridContainer>
    )
  }
}

FamilyList.propTypes = {
};

export default FamilyList;
