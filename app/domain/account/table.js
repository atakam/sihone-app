const pool = require('../../../databasePool');

class AccountTable {
  static addAccount(account) {
    const {
      descriptiontext,
      accountdate,
      isopen,
      candelete
     } = account;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO accounts(
          descriptiontext,
          accountdate,
          isopen,
          candelete
        ) VALUES($1, $2, $3, $4) RETURNING id`,
        [
          descriptiontext,
          accountdate,
          isopen,
          candelete
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ accountid: response.rows[0].id});
        }
      )
    });
  }

  static getAccount({ accountid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          accountdate,
          isopen,
          candelete
        FROM accounts
        WHERE accounts.id = $1`,
        [accountid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no account'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getAccounts() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          accountdate,
          isopen,
          candelete
        FROM accounts`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateAccount(account) { 
    const {
      accountid,
      descriptiontext,
      accountdate,
      isopen
    } = account

    return new Promise((resolve, reject) => {
      if (!accountid) return reject('accountid is null');
      pool.query(
        `UPDATE accounts
         SET descriptiontext = $1, accountdate = $2, isopen = $3
         WHERE id = $4`,
        [descriptiontext, accountdate, isopen, accountid],
        (error, response) => {
          if (error) return reject(error);
          resolve(accountid);
        }
      );
    });
  }

  static deleteAccount({ accountid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM accounts
        WHERE accounts.id = $1 AND accounts.canDelete = $2`,
        [accountid, true],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = AccountTable;
