import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Calendar from 'react-calendar'

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import Utils from "../utils/Utils";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      dataCount: {
        families: 0,
        children: 0,
        groups: 0,
        members: 0,
        dataSeries: [],
  
        welcome: '',
        date: new Date()
      }
    };
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  onChange = date => this.setState({ date })

  componentDidMount() {
    if (!Utils.isMember(this.props.account.role) && !Utils.isVisitor(this.props.account.role)){
      this.getMonthlyBreakdown();
      this.fetchFamilies();
      this.fetchGroups();
      this.fetchMembers();
    }
    this.fetchSettings();
  }

  fetchMembers = () => {
    fetch('/member/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      const children = (
        json.members.filter((member) => {
          if (member.birthdate) {
            const bdate = member.birthdate.split('T')[0].split('-');
            return Math.ceil((new Date() - new Date(Number(bdate[0]), Number(bdate[1])-1, Number(bdate[2]))) / (1000 * 3600 * 24)) / 365 < 18;
          } else return false;
        })
      )

      let dataCount = this.state.dataCount;
      dataCount.members = json.members.length;
      dataCount.children = children.length;

      this.setState({
        dataCount: dataCount
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchFamilies = () => {
    fetch('/family/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);

      let dataCount = this.state.dataCount;
      dataCount.families = json.families.length;

      this.setState({
        dataCount: dataCount
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchGroups = () => {
    fetch('/group/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);

      let dataCount = this.state.dataCount;
      dataCount.groups = json.groups.length;

      this.setState({
        dataCount: dataCount
      })
    })
    .catch(error => console.log('error', error));
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        welcome: json.settings.welcome
      })
    })
    .catch(error => console.log('error', error));
  }

  getMonthlyBreakdown = () => {
    fetch('/donation/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      let series = [0,0,0,0,0,0,0,0,0,0,0,0];
      json.donations.map((donation) => {
        if (new Date(donation.paydate.split('T')[0]).getFullYear() === new Date().getFullYear()) {
          series[new Date(donation.paydate.split('T')[0]).getMonth()] += donation.amount;
        }
        return null;
      });
      this.setState({
        dataSeries: series
      })
    })
    .catch(error => console.log('error', error));
  }

  render() {
    const {
      classes,
      topData,
      charts
    } = this.props;
    return (
      <div>
        {
          (Utils.isMember(this.props.account.role) || Utils.isVisitor(this.props.account.role)) ? (
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="info">
                    <h4>Welcome!</h4>
                  </CardHeader>
                  <CardBody>
                    <div dangerouslySetInnerHTML={{__html: this.state.welcome}}></div>
                  </CardBody>
                </Card>
                </GridItem>
            </GridContainer>
          ) : (
          <GridContainer>
            {topData.map((data, key) => {
              return (
                <GridItem xs={12} sm={6} md={3} key={key}>
                  <Card>
                    <CardHeader color={data.colorValue} stats icon>
                      <CardIcon color={data.colorValue}>
                        {data.icon}
                      </CardIcon>
                      <p className={classes.cardCategory}>{data.title}</p>
                      <h3 className={classes.cardTitle}>
                        {this.state.dataCount[data.key]}
                      </h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        {data.captionIcon}
                        <a href={data.captionLink}>
                          {data.caption}
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
              )
            })}
            { (this.state.dataSeries && this.state.dataSeries.length) > 0 && (
              charts.map((chart, key) => {
              chart.data.series = [this.state.dataSeries];
              return (
                <GridItem xs={12} sm={12} md={6} key={key}>
                  <Card chart>
                    <CardHeader color={chart.colorValue}>
                      <ChartistGraph
                        className="ct-chart"
                        data={chart.data}
                        type="Bar"
                        options={chart.options}
                        responsiveOptions={chart.responsiveOptions}
                        listener={chart.animation}
                      />
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>{chart.title}</h4>
                      <p className={classes.cardCategory}>
                        {chart.subtitle1}
                      </p>
                    </CardBody>
                    <CardFooter chart>
                      <div className={classes.stats}>
                        {chart.subicon} {chart.subtitle2}
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
              )
            }))}
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color={'danger'}>
                  <h4 className={classes.cardTitleWhite}>Calendar</h4>
                </CardHeader>
                <CardBody>
                  <Calendar
                    onChange={this.onChange}
                    value={this.state.date}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          )
        }
        
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  topData: PropTypes.arrayOf(PropTypes.shape({
     title: PropTypes.node,
     value: PropTypes.node,
     icon: PropTypes.object,
     caption: PropTypes.string,
     captionIcon: PropTypes.object,
     captionLink: PropTypes.string,
     colorValue: PropTypes.string
   })),
   charts: PropTypes.arrayOf(PropTypes.shape({
      data: PropTypes.object,
      options: PropTypes.object,
      responsiveOptions: PropTypes.array,
      animation: PropTypes.object,
      colorValue: PropTypes.string,
      title: PropTypes.node,
      subtitle1: PropTypes.node,
      subtitle2: PropTypes.node,
      subicon: PropTypes.object
    })),
    lists: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.node,
      subtitle: PropTypes.node,
      headers: PropTypes.array,
      data: PropTypes.array
    }))
};

export default connect(
  ({ account }) => ({ account }),
  null
)( withStyles(dashboardStyle)(Dashboard));
