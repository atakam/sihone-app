const pool = require('../../../databasePool');
const MemberTable = require('../member/table');
const GroupTable = require('../group/table');

class MemberGroupTable {
  static addMemberGroup({ memberid, groupid }) {

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO membergroup(
          memberid,
          groupid
        ) VALUES($1, $2)`,
        [
          memberid, groupid
        ],
        (error, response) => {
          if (error) return reject(error);
          resolve();
        }
      )
    });
  }

  static getMembersByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          memberid
        FROM membergroup
        WHERE groupid = $1`,
        [groupid],
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

  static getGroupsByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groupid
        FROM membergroup
        WHERE memberid = $1`,
        [memberid],
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

  static deleteMemberGroupByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM membergroup
        WHERE groupid = $1`,
        [groupid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteMemberGroupByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM membergroup
        WHERE memberid = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteMemberGroupByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM membergroup
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

module.exports = MemberGroupTable;
