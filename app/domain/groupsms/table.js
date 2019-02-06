const pool = require('../../../databasePool');
const GroupTable = require('../group/table');
const SmsTable = require('../sms/table');

class GroupSmsTable {
  static addGroupSms({ groupid, smsid }) {
    return new Promise((resolve, reject) => {
      if (Number(groupid) === 0) return resolve(true);
      pool.query(
        `INSERT INTO groupsms(
          groupid,
          smsid,
          issent
        ) VALUES($1, $2, $3)`,
        [
          groupid, smsid, true
        ],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static getGroupsBySmsId({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groupid,
          groupname
        FROM groupsms
        LEFT JOIN groups ON groups.id = groupsms.groupid
        WHERE smsid = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getSmsByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          smsid,
          smstext,
          smsdate
        FROM groupsms
        LEFT JOIN sms ON sms.id = groupsms.smsid
        WHERE groupid = $1`,
        [groupid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getSmsStatusesBySmsId({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groupid,
          issent
        FROM groupsms
        WHERE smsid = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static deleteGroupSmsBySmsId({ smsid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groupsms
        WHERE smsid = $1`,
        [smsid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteGroupSmsByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groupsms
        WHERE groupid = $1`,
        [groupid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = GroupSmsTable;
