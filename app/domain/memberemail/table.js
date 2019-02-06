const pool = require('../../../databasePool');
const MemberTable = require('../member/table');
const EmailTable = require('../email/table');

class MemberEmailTable {
  static addMemberEmail({ memberids, emailid }) {
    return Promise.all(
      memberids.map(
        (memberid) => {
          return new Promise((resolve, reject) => {
            pool.query(
              `INSERT INTO memberemail(
                memberid,
                emailid,
                issent
              ) VALUES($1, $2, $3)`,
              [
                memberid, emailid, true
              ],
              (error, response) => {
                if (error) return reject(error);
                resolve(true);
              }
            )
          });
        }
      )
    )
  }

  static getMembersByEmailId({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          memberid
        FROM memberemail
        WHERE emailid = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((memberIdArray) => {
      Promise.all(
        memberIdArray.map(
          ({ memberid }) => MemberTable.getMember({ memberid })
        )
      ).then(members => resolve({ members }))
       .catch(error => reject(error));
    });
  }

  static getEmailByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          emailid
        FROM memberemail
        WHERE memberid = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((emailIdArray) => {
      Promise.all(
        emailIdArray.map(
          ({ emailid }) => EmailTable.getEmail({ emailid })
        )
      ).then(email => resolve({ email }))
       .catch(error => reject(error));
    });
  }

  static getEmailStatusesByEmailId({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          memberid,
          issent
        FROM memberemail
        WHERE emailid = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((memberIdArray) => {
      Promise.all(
        memberIdArray.map(
          ({ memberid }) => MemberTable.getMember({ memberid })
        )
      ).then(members => resolve({ members }))
       .catch(error => reject(error));
    });
  }

  static deleteMemberEmailByEmailId({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM memberemail
        WHERE emailid = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteMemberEmailByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM memberemail
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

module.exports = MemberEmailTable;
