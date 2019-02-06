import React from "react";
import PropTypes from "prop-types";

class StatementSummary extends React.Component {
    render() {
        const donations = this.props.donations;
        let fundids = donations.map((donation) =>{
            return donation.fundid;
        });
        fundids = [...new Set(fundids)];

        const objects = fundids.map((id) => {
            let amount = 0;
            let name = '';
            donations.map((don) => {
                if (id === don.fundid) {
                    name = don.fundname
                    amount += don.amount;
                }
                return null;
            });
            return {
                name: name,
                amount: amount
            }
        });

        let total = 0;
        return (
            <div>
                <div className='title'>Summary</div>
                <table>
                    <thead>
                        <tr>
                            <th>Tax Deductible</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            objects.map((obj, i) => {
                                total = total + obj.amount;
                                return (<tr key={i}>
                                    <td>{obj.name}</td>
                                    <td>$ {obj.amount}</td>
                                </tr>);
                            })
                        }
                        <tr>
                            <td>TOTAL</td>
                            <td>$ {total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
StatementSummary.propTypes = {
  donations: PropTypes.array
};
export default StatementSummary;