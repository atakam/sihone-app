import React from "react";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import MemberSelect from '../../utils/MemberSelect.jsx';
import GroupSelect from '../../utils/GroupSelect';
import Utils from "../../utils/Utils";

class MemberList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            members: [],
            groups: [],
            specials: []
        };
    }

    handleAddMember = (member) => {
        this.setState({
            members: [member],
            groups: [],
            specials: []
            }, this.onMemberClick(member.id));
    }

    handleAddGroup = (group) => {
        this.setState({
            groups: [group],
            members: [],
            specials: []
        }, this.onGroupClick(group.id));
    }

    handleAddSpecial = (special) => {
        this.setState({
            specials: [special],
            members: [],
            groups: []
        }, this.onSpecialClick(special));
    }

    onMemberClick = (memberid) => {
        this.props.onMemberSelected(memberid);
    }

    onGroupClick = (groupid) => {
        this.props.onGroupSelected(groupid);
    }

    onSpecialClick = (special) => {
        this.props.onSpecialSelected(special);
    }

    render(){
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardBody>
                        <TextField
                            id="select-special"
                            select
                            label="Predefined Groups"
                            value={this.state.specials[0] ? this.state.specials[0].value : ''}
                            onChange={(e) => this.handleAddSpecial(e.target.value)}
                            margin="normal"
                            fullWidth
                            >
                            {Utils.getPredefinedGroups().map(option => (
                                <MenuItem key={option.value} value={{value: option.value, label: option.label}}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Table
                            tableHeaderColor="primary"
                            tableData={
                                this.state.specials.map(
                                    (group, index) => {
                                        return (
                                            [
                                            group.value,
                                            group.label
                                            ]
                                        )
                                    }
                                )
                            }
                        />
                        <MemberSelect
                            placeholder="Members"
                            value={''}
                            onChange={this.handleAddMember}
                            phoneOnly
                        />
                        <Table
                            tableHeaderColor="primary"
                            tableData={
                                this.state.members.map(
                                    (member, index) => {
                                        return (
                                            [
                                            member.id,
                                            member.firstname + " " + member.lastname
                                            ]
                                        )
                                    }
                                )
                            }
                        />
                        <GroupSelect
                            placeholder="Groups"
                            value={''}
                            onChange={this.handleAddGroup}
                            phoneOnly
                        />
                        <Table
                            tableHeaderColor="primary"
                            tableData={
                                this.state.groups.map(
                                    (group, index) => {
                                        return (
                                            [
                                            group.id,
                                            group.label
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
export default MemberList;