import React from "react";
import PropTypes from "prop-types";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import MemberView from './MemberView.jsx';

import Utils from "../utils/Utils";

class MembersList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openMember: 0,
      members: []
    };
  }

  onEdit = (id) => {
      this.setState({ openMember: id });
  }

  handleCloseMember = () => {
    this.setState({ openMember: 0 });
    this.fetchMembers();
  }

  componentDidMount () {
    this.fetchMembers();
  }

  fetchMembers = () => {
    let url = this.props.active ? '/member/findAll' : '/member/findInactive';
    fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        members: json.members
      });
      this.props.refreshNumbers && this.props.refreshNumbers();
    })
    .catch(error => console.log('error', error));
  }

  render() {
    const members = (
      this.state.members.filter((member) => {
        if (!this.props.isChildren) return true;
        else if (member.birthdate) {
          const bdate = member.birthdate.split('T')[0].split('-');
          return Math.ceil((new Date() - new Date(Number(bdate[0]), Number(bdate[1])-1, Number(bdate[2]))) / (1000 * 3600 * 24)) / 365 < 18;
        } else return false;
      })
    );
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={'warning'}>
              {this.props.tabs}
            </CardHeader>
            <CardBody>
              <CustomInput
                labelText={'Search'}
                id="search-members"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  autoFocus: true,
                  onKeyUp: (event) => Utils.searchTable(event.target, 'members-table')
                }}
              />
              <Table
                id='members-table'
                tableHeaderColor="primary"
                tableHead={["Name", "Roles", "Email", "Phone", "Family", this.props.isChildren ? "Age" : "Date Joined", "Member Id"]}
                tableData={
                  members.map(
                    (member, index) => {
                      return (
                        [
                          member.id,
                          member.firstname + " " + member.lastname,
                          member.memberrole,
                          member.email,
                          member.phone,
                          member.familyname,
                          this.props.isChildren ? member.age : member.membershipdate ? member.membershipdate.split('T')[0] : member.membershipdate,
                          member.memberuid
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
        <MemberView
          open={this.state.openMember > 0}
          onClose={this.handleCloseMember}
          memberId={this.state.openMember}
        />
      </GridContainer>
    )
  }
}

MembersList.propTypes = {
  isChildren: PropTypes.bool,
  active: PropTypes.bool,
  tabs: PropTypes.object
};

export default MembersList;
