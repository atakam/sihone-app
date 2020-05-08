const pool = require('../../../databasePool');

class DonationTable {
  static addDonation(donation) {
    const {
      envelopeid,
      memberid,
      paytype,
      paydate,
      checknumber
     } = donation;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO donations(
          envelopeid,
          memberid,
          paytype,
          paydate,
          checknumber
        ) VALUES($1, $2, $3, $4, $5) RETURNING id`,
        [
          envelopeid,
          memberid,
          paytype,
          paydate,
          checknumber
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ donationid: response.rows[0].id});
        }
      )
    });
  }

  static getDonation({ donationid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          envelopeid,
          memberid,
          paytype,
          paydate,
          checknumber
        FROM donations
        WHERE donations.id = $1`,
        [donationid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no donation'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getDonationsByEnvelopeId({ envelopeid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          donations.id,
          envelopeid,
          memberid,
          paytype,
          paydate,
          checknumber,
          firstname,
          lastname,
          active,
          funds.id AS fundid,
          fundname,
          amount
        FROM donations
        LEFT JOIN members
        ON memberid = members.id
        LEFT JOIN donationfund
        ON donationid = donations.id
        LEFT JOIN funds
        ON donationfund.fundid = funds.id
        WHERE donations.envelopeid = $1`,
        [envelopeid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getDonationsByQuickFilter({ memberid, quickFilter }) {
    let filter = '';
    if (quickFilter === 'last30') {
      filter = " AND paydate >= DATE(NOW()) - INTERVAL '30' DAY";
    } else if (quickFilter === 'last60') {
      filter = " AND paydate >= DATE(NOW()) - INTERVAL '60' DAY";
    }
    else if (quickFilter === 'last90') {
      filter = " AND paydate >= DATE(NOW()) - INTERVAL '90' DAY";
    }
    else if (quickFilter === 'thisYear') {
      filter = " AND extract(year from paydate) = (extract(year from CURRENT_TIMESTAMP))";
    }
    else if (quickFilter === 'lastYear') {
      filter = " AND extract(year from paydate) = (extract(year from CURRENT_TIMESTAMP) - 1)";
    }
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          donations.id,
          envelopeid,
          memberid,
          paytype,
          paymenttype,
          paydate,
          checknumber,
          firstname,
          lastname,
          funds.id AS fundid,
          fundname,
          amount
        FROM donations
        LEFT JOIN members
        ON memberid = members.id
        LEFT JOIN donationfund
        ON donationid = donations.id
        LEFT JOIN funds
        ON donationfund.fundid = funds.id
        LEFT JOIN paymenttypes
        ON paytype = paymenttypes.id
        WHERE members.id = $1
        ${filter}`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getDonationsByCustomFilter({ memberid, to, from }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          donations.id,
          envelopeid,
          memberid,
          paytype,
          paymenttype,
          paydate,
          checknumber,
          firstname,
          lastname,
          funds.id AS fundid,
          fundname,
          amount
        FROM donations
        LEFT JOIN members
        ON memberid = members.id
        LEFT JOIN donationfund
        ON donationid = donations.id
        LEFT JOIN funds
        ON donationfund.fundid = funds.id
        LEFT JOIN paymenttypes
        ON paytype = paymenttypes.id
        WHERE members.id = $1 AND paydate BETWEEN $2::date AND $3::date`,
        [memberid, from, to],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getDonations() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          donations.id AS id,
          envelopeid,
          memberid,
          paytype,
          paydate,
          checknumber,
          amount
        FROM donations
        LEFT JOIN donationfund
        ON donationid = donations.id`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateDonation(donation) { 
    const {
      donationid,
      memberid,
      paytype,
      paydate,
      checknumber
    } = donation;

    return new Promise((resolve, reject) => {
      if (!donationid) return reject('donationid is null');
      pool.query(
        `UPDATE donations SET
          memberid = $1,
          paytype = $2,
          paydate = $3,
          checknumber = $4
         WHERE id = $5`,
        [
          memberid,
          paytype,
          paydate,
          checknumber,
          donationid],
        (error, response) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  static deleteDonation({ donationid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM donations
        WHERE donations.id = $1`,
        [donationid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = DonationTable;
