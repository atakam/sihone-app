import React from "react";
import PropTypes from "prop-types";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

class ActivityList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activities: []
    }
  }

  componentDidMount () {
    this.fetchActivities();
  }

  fetchActivities = () => {
    fetch('/activity/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        activities: json.activities
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info">
              <p>All database modifications are logged on this page.</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["User", "Activity", "Timestamp"]}
                tableData={
                  this.state.activities.map(
                    (activity, index) => {
                      return (
                        [
                          activity.id,
                          activity.firstname + ' ' + activity.lastname ,
                          activity.descriptiontext,
                          activity.activitydate ? (activity.activitydate.split('T')[0] + ' ' +  (activity.activitydate.split('T')[1] ? activity.activitydate.split('T')[1].split('.')[0] : '')) : ''
                        ]
                      )
                    }
                  )
                }
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    )
  }
}

ActivityList.propTypes = {
  isChildren: PropTypes.bool
};

export default ActivityList;
