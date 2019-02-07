const pool = require('../../../databasePool');
const GroupTable = require('../group/table');
const EventTable = require('../event/table');

class GroupEventTable {
  static addGroupEvent({ groups, eventid }) {
    return Promise.all(
      groups.map(
        (group) => {
          return new Promise((resolve, reject) => {
            pool.query(
              `INSERT INTO groupevent(
                groupid,
                eventid
              ) VALUES($1, $2)`,
              [
                group.id, eventid
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

  static getGroupsByEventId({ eventid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          groupid
        FROM groupevent
        WHERE eventid = $1`,
        [eventid],
        (error, response) => {
          if (error) return reject(error);

          console.log('GEV:', response.rows);
          resolve(response.rows);
        }
      )
    })
  }

  static getEventByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          eventid
        FROM groupevent
        WHERE groupid = $1`,
        [groupid],
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

  static deleteGroupEventByEventId({ eventid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groupevent
        WHERE eventid = $1`,
        [eventid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteGroupEventByGroupId({ groupid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM groupevent
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

module.exports = GroupEventTable;
