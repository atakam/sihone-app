import React from "react";
import SmsList from "./SmsList";
import SmsView from "./SmsView";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

class SmsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberId: 0,
            groupId: 0,
            special: null
        };
    }

    setMemberId = (memberId) => {
        this.setState({
            memberId: memberId,
            groupId: 0,
            special: null
        });
    }

    setGroupId = (groupId) => {
        this.setState({
            memberId: 0,
            groupId: groupId,
            special: null
        });
    }

    setSpecial = (special) => {
        this.setState({
            memberId: 0,
            groupId: 0,
            special: special
        });
    }

    render(){
        const {
            memberId,
            groupId,
            special
        } = this.state;
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <SmsList
                        onMemberSelected={this.setMemberId}
                        onGroupSelected={this.setGroupId}
                        onSpecialSelected={this.setSpecial}
                    />
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                    {
                        (memberId || groupId || special) && (
                            <SmsView
                                key={new Date().getTime()}
                                memberId={memberId}
                                groupId={groupId}
                                special={special}
                            />
                        )
                    }
                </GridItem>
            </GridContainer>
        )
    }
}
export default SmsApp;
