const pool = require('../../../databasePool');

class SmsTable {
  static addSms(sms) {
    const {
      smstext,
      smsdate,
      special
     } = sms;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO sms(
          smstext,
          smsdate,
          specials
        ) VALUES($1, $2, $3) RETURNING id`,
        [
          smstext,
          smsdate,
          special
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ smsid: response.rows[0].id});
        }
      )
    });
  }

  static getSms({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          smstext,
          smsdate
        FROM sms
        WHERE sms.id = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no sms'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getSmsBySpecial({ special }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          smstext,
          smsdate
        FROM sms
        WHERE sms.specials = $1`,
        [special],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getSms() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          smsid,
          smstext,
          smsdate
        FROM membersms
        LEFT JOIN sms ON sms.id = membersms.smsid`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
  }

  static getAllSms() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          sms.id,
          smstext,
          smsdate,
          specials,
          members.id AS memberid,
          firstname,
          lastname,
          groups.id AS groupid,
          groupname
        FROM sms
        LEFT JOIN membersms ON membersms.smsid = sms.id
        LEFT JOIN groupsms ON groupsms.smsid = sms.id
        LEFT JOIN members ON membersms.memberid = members.id
        LEFT JOIN groups ON groupsms.groupid = groups.id`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static deleteSms({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM sms
        WHERE sms.id = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = SmsTable;
