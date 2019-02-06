const pool = require('../../../databasePool');

class EnvelopeTable {
  static addEnvelope(envelope) {
    const {
      descriptiontext,
      envelopedate,
      isopen,
      accountid
     } = envelope;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO envelopes(
          descriptiontext,
          envelopedate,
          isopen,
          accountid
        ) VALUES($1, $2, $3, $4) RETURNING id`,
        [
          descriptiontext,
          envelopedate,
          isopen,
          accountid
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ envelopeid: response.rows[0].id});
        }
      )
    });
  }

  static getEnvelope({ envelopeid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          envelopedate,
          isopen,
          accountid
        FROM envelopes
        WHERE envelopes.id = $1`,
        [envelopeid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no envelope'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getEnvelopes() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          envelopedate,
          isopen,
          accountid
        FROM envelopes`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateEnvelope(envelope) { 
    const {
      envelopeid,
      descriptiontext,
      envelopedate,
      isopen,
      accountid
    } = envelope

    return new Promise((resolve, reject) => {
      if (!envelopeid) return reject('envelopeid is null');
      pool.query(
        `UPDATE envelopes SET
          descriptiontext = $1,
          envelopedate = $2,
          isopen = $3,
          accountid = $4
         WHERE id = $5`,
        [descriptiontext, envelopedate, isopen, accountid, envelopeid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static getEnvelopesByAccountId({accountid}) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          descriptiontext,
          envelopedate,
          isopen,
          accountid
        FROM envelopes
        WHERE accountid = $1`,
        [accountid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static deleteEnvelope({ envelopeid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM envelopes
        WHERE envelopes.id = $1`,
        [envelopeid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = EnvelopeTable;
