const pool = require('../../../databasePool');

class TransactionTable {
  static addTransaction(transaction) {
    const {
      descriptiontext,
      accountid,
      transactiontype,
      transactiondate,
      amount
     } = transaction;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO transactions(
          descriptiontext,
          accountid,
          transactiontype,
          transactiondate,
          amount
        ) VALUES($1, $2, $3, $4, $5) RETURNING id`,
        [
          descriptiontext,
          accountid,
          transactiontype,
          transactiondate,
          amount
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ transactionid: response.rows[0].id});
        }
      )
    });
  }

  static getTransaction({ transactionid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          accountid,
          transactiontype,
          transactiondate,
          amount
        FROM transactions
        WHERE transaction.id = $1`,
        [transactionid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no transaction'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getTransactions() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          accountid,
          transactiontype,
          transactiondate,
          amount
        FROM transactions`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getTransactionsByAccountId({accountid}) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          accountid,
          transactiontype,
          transactiondate,
          amount
        FROM transactions
        WHERE accountid = $1`,
        [accountid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateTransaction(transaction) { 
    const {
      transactionid,
      accountid,
      transactiontype,
      transactiondate,
      amount,
      descriptiontext
    } = transaction

    return new Promise((resolve, reject) => {
      if (!transactionid) return reject('transactionid is null');
      pool.query(
        `UPDATE transactions SET
          accountid = $1,
          transactiontype = $2,
          transactiondate = $3,
          amount = $4,
          descriptiontext = $5
         WHERE id = $6`,
        [ accountid,
          transactiontype,
          transactiondate,
          amount,
          descriptiontext,
          transactionid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static deleteTransaction({ transactionid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM transactions
        WHERE transactions.id = $1`,
        [transactionid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = TransactionTable;
