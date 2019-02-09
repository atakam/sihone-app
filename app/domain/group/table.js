const pool = require('../../../databasePool');

class GroupTable {
  static addGroup(group) {
    const {
      groupname,
      grouptypeid
     } = group;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO groups(
          groupname,
          grouptypeid
        ) VALUES($1, $2) RETURNING id`,
        [
          groupname,
          grouptypeid
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ grouptypeid: response.rows[0].id});
        }
      )
    });
  }

  static getGroup({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          groupname,
          grouptypeid
        FROM groups
        WHERE groups.id = $1`,
        [groupid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no group'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getGroups() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groups.id,
          groupname,
          grouptypeid,
          grouptypes.grouptype
        FROM groups LEFT JOIN grouptypes ON grouptypes.id = groups.grouptypeid`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getGroupsWithEmails() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
        groups.id,
        groupname,
        grouptypeid,
        grouptypes.grouptype,
        members.email
      FROM groups
      LEFT JOIN grouptypes ON grouptypes.id = groups.grouptypeid
      LEFT JOIN membergroup ON membergroup.groupid = groups.id
      LEFT JOIN members ON members.id = membergroup.memberid
      WHERE email IS NOT NULL AND members.subscribtion IS TRUE`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getPhones(groupid) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          phone
        FROM membergroup
        LEFT JOIN members ON memberid = members.id
        WHERE groupid = $1`,
        [groupid],
        (error, response) => {
          if (error) return reject(error);
          response.rows.length === 0 && resolve('')
          response.rows.length > 0 && resolve(response.rows.map((row) => row.phone));
        }
      )
    });
  }

  static getEmails(groupids) {
    return Promise.all(
      groupids.map((groupid) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT
              email
            FROM membergroup
            LEFT JOIN members ON memberid = members.id
            WHERE groupid = $1 AND email IS NOT NULL AND members.subscribtion IS TRUE`,
            [groupid],
            (error, response) => {
              if (error) return reject(error);
              response.rows.length === 0 && resolve('')
              response.rows.length > 0 && resolve(response.rows.map((row) => row.email));
            }
          )
        });
      })
    );
  }

  static getGroupsByMemberId(memberId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groups.id,
          groupname,
          grouptypeid
        FROM groups
        LEFT JOIN membergroup ON membergroup.groupid = groups.id
        WHERE membergroup.memberid = $1`,
        [memberId],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateGroup(grouptype) { 
    const {
      groupid,
      groupname,
      grouptypeid
    } = grouptype

    return new Promise((resolve, reject) => {
      if (!groupid) return reject('groupid is null');
      pool.query(
        `UPDATE groups SET groupname = $1, grouptypeid = $2 WHERE id = $3`,
        [groupname, grouptypeid, groupid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static deleteGroup({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groups
        WHERE groups.id = $1`,
        [groupid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = GroupTable;
