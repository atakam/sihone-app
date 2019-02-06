const pool = require('../../../databasePool');
const MemberTable = require('../member/table');
const SmsTable = require('../sms/table');

class MemberSmsTable {
  static addMemberSms({ memberid, smsid }) {
    return new Promise((resolve, reject) => {
      if (Number(memberid) === 0) return resolve(true);
      pool.query(
        `INSERT INTO membersms(
          memberid,
          smsid,
          issent
        ) VALUES($1, $2, $3)`,
        [
          memberid, smsid, true
        ],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static getMembersBySmsId({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          memberid,
          firstname,
          lastname
        FROM membersms
        LEFT JOIN members ON members.id = membersms.memberid
        WHERE smsid = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
  }

  static getSmsByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          smsid,
          smstext,
          smsdate
        FROM membersms
        LEFT JOIN sms ON sms.id = membersms.smsid
        WHERE memberid = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
  }

  static getSmsStatusesBySmsId({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          memberid,
          issent
        FROM membersms
        WHERE smsid = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
  }

  static deleteMemberSmsBySmsId({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM membersms
        WHERE smsid = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteMemberSmsByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM membersms
        WHERE memberid = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = MemberSmsTable;
