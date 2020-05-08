import React from "react";
import Table from "components/Table/Table.jsx";
import GridItem from "components/Grid/GridItem.jsx";

class EmailList extends React.Component {
  render(){
    return (
        <GridItem xs={12} sm={5} md={5}>
            <Table
                tableHeaderColor="primary"
                tableHead={["Date", "Subject","To"]}
                tableData={
                this.props.emails.map(
                    (mail) => {
                    return (
                        [
                        mail.id,
                        mail.date,
                        mail.subject,
                        mail.to
                        ]
                    )
                    }
                )
                }
                onRowClick={this.props.onSelectEmail}
                rowActions={this.props.actions}
                classes={{tableResponsive: 'emaillist'}}
            />
        </GridItem>
    );
  }
}
export default EmailList;
