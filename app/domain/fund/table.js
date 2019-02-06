const pool = require('../../../databasePool');

class FundTable {
  static addFund(fund) {
    const {
      fundname
     } = fund;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO funds(
          fundname
        ) VALUES($1) RETURNING id`,
        [
          fundname
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ fundid: response.rows[0].id});
        }
      )
    });
  }

  static getFund({ fundid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          fundname
        FROM funds
        WHERE funds.id = $1`,
        [fundid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no fund'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getFunds() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          fundname
        FROM funds`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateFund(fund) { 
    const {
      fundid,
      fundname
    } = fund

    return new Promise((resolve, reject) => {
      if (!fundid) return reject('fundid is null');
      pool.query(
        `UPDATE funds SET fundname = $1 WHERE id = $2`,
        [fundname, fundid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static deleteFund({ fundid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM funds
        WHERE funds.id = $1`,
        [fundid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = FundTable;
