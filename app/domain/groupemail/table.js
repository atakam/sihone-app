const pool = require('../../../databasePool');
const GroupTable = require('../group/table');
const EmailTable = require('../email/table');

class GroupEmailTable {
  static addGroupEmail({ groupids, emailid }) {
    return Promise.all(
      groupids.map(
        (groupid) => {
          return new Promise((resolve, reject) => {
            pool.query(
              `INSERT INTO groupemail(
                groupid,
                emailid,
                issent
              ) VALUES($1, $2, $3)`,
              [
                Number(groupid), emailid, true
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

  static getGroupsByEmailId({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groupid
        FROM groupemail
        WHERE emailid = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((groupIdArray) => {
      Promise.all(
        groupIdArray.map(
          ({ groupid }) => GroupTable.getGroup({ groupid })
        )
      ).then(groups => resolve({ groups }))
       .catch(error => reject(error));
    });
  }

  static getEmailByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          emailid
        FROM groupemail
        WHERE groupid = $1`,
        [groupid],
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
          groupid,
          issent
        FROM groupemail
        WHERE emailid = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((groupIdArray) => {
      Promise.all(
        groupIdArray.map(
          ({ groupid }) => GroupTable.getGroup({ groupid })
        )
      ).then(groups => resolve({ groups }))
       .catch(error => reject(error));
    });
  }

  static deleteGroupEmailByEmailId({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groupemail
        WHERE emailid = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteGroupEmailByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groupemail
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

module.exports = GroupEmailTable;
