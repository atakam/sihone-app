const pool = require('../../../databasePool');
const DonationTable = require('../donation/table');
const FundTable = require('../fund/table');

class DonationFundTable {
  static addDonationFund({ donationid, fundid, amount }) {

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO donationfund(
          donationid,
          fundid,
          amount
        ) VALUES($1, $2, $3)`,
        [
          donationid, fundid, amount
        ],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static getDonationsByFundId({ fundid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          donationid,
          amount
        FROM donationfund
        WHERE fundid = $1`,
        [fundid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((donationIdArray) => {
      Promise.all(
        donationIdArray.map(
          ({ donationid }) => DonationTable.getDonation({ donationid })
        )
      ).then(donations => resolve({ donations }))
       .catch(error =>console.log(error.message));
    });
  }

  static getFundsByDonationId({ donationid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          fundid,
          amount
        FROM donationfund
        WHERE donationid = $1`,
        [donationid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((fundIdArray) => {
      Promise.all(
        fundIdArray.map(
          ({ fundid }) => FundTable.getFund({ fundid })
        )
      ).then(funds => resolve({ funds }))
      .catch(error =>console.log(error.message));
    });
  }

  static deleteDonationFundByFundId({ fundid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM donationfund
        WHERE fundid = $1`,
        [fundid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteDonationFundByDonationId({ donationid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM donationfund
        WHERE donationid = $1`,
        [donationid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static updateDonationFund(donationfund) {
    const {
      donationid, fundid, amount
    } = donationfund

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE donationfund SET
          amount = $1
         WHERE donationid = $2 AND fundid = $3`,
        [amount, donationid, fundid],
        (error, response) => {
          if (error) return reject(error);
          resolve(donationfund );
        }
      )
    });
  }
}

module.exports = DonationFundTable;
