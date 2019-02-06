const pool = require('../../../databasePool');

class PaymentTypeTable {
  static addPaymentType(paymenttypeobj) {
    const {
      paymenttype
     } = paymenttypeobj;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO paymenttypes(
          paymenttype
        ) VALUES($1) RETURNING id`,
        [
          paymenttype
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ paymenttypeid: response.rows[0].id});
        }
      )
    });
  }

  static getPaymentType({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          paymenttype
        FROM paymenttypes
        WHERE paymenttypes.id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return;

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getPaymentTypeName({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          paymenttype
        FROM paymenttypes
        WHERE paymenttypes.id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return;

          resolve(response.rows[0].paymenttype);
        }
      )
    });
  }

  static getPaymentTypes() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          paymenttype
        FROM paymenttypes`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updatePaymentType(paymenttypeobj) { 
    const {
      paymenttypeid,
      paymenttype
    } = paymenttypeobj

    return new Promise((resolve, reject) => {
      if (!paymenttypeid) return reject('paymenttypeid is null');
      pool.query(
        `UPDATE paymenttypes SET paymenttype = $1 WHERE id = $2`,
        [paymenttype, paymenttypeid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static deletePaymentType({ paymenttypeid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM paymenttypes
        WHERE paymenttypes.id = $1`,
        [paymenttypeid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = PaymentTypeTable;
