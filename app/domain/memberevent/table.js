const pool = require('../../../databasePool');
const MemberTable = require('../member/table');
const EventTable = require('../event/table');

class MemberEventTable {
  static addMemberEvent({ guests, eventid }) {
    console.log('MMMMMM', guests);
    return Promise.all(
      guests.map(
        (member) => {
          return new Promise((resolve, reject) => {
            pool.query(
              `INSERT INTO memberevent(
                memberid,
                eventid
              ) VALUES($1, $2)`,
              [
                member.id, eventid
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

  static getMembersByEventId({ eventid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          memberid
        FROM memberevent
        WHERE eventid = $1`,
        [eventid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
  }

  static getEventByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          eventid
        FROM memberevent
        WHERE memberid = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    })
    .then((eventIdArray) => {
      Promise.all(
        eventIdArray.map(
          ({ eventid }) => EventTable.getEvent({ eventid })
        )
      ).then(event => resolve({ event }))
       .catch(error => reject(error));
    });
  }

  static deleteMemberEventByEventId({ eventid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM memberevent
        WHERE eventid = $1`,
        [eventid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteMemberEventByMemberId({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM memberevent
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

module.exports = MemberEventTable;
