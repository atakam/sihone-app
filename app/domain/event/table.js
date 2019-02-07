const pool = require('../../../databasePool');

class EventTable {
  static addEvent(event) {
    const {
      description,
      location,
      startdate,
      enddate,
      allday,
      repeat,
     } = event;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO events(
          description,
          location,
          startdate,
          enddate,
          allday,
          repeat
        ) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          description,
          location,
          startdate,
          enddate,
          allday,
          repeat,
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ eventid: response.rows[0].id});
        }
      )
    });
  }

  static getEvent({ eventid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          description,
          location,
          startdate,
          enddate,
          allday,
          repeat,
        FROM events
        WHERE events.id = $1`,
        [eventid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no event'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getAllEvent() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          events.id AS eventid,
          events.description,
          location,
          startdate,
          enddate,
          allday,
          repeat,
          firstname,
          lastname,
          groupname,
          groups.id AS groupid,
          members.id AS memberid
        FROM events
        LEFT JOIN memberevent ON events.id = memberevent.eventid
        LEFT JOIN members ON memberevent.memberid = members.id
        LEFT JOIN groupevent ON events.id = groupevent.eventid
        LEFT JOIN groups ON groupevent.groupid = groups.id`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static deleteEvent({ eventid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM events
        WHERE events.id = $1`,
        [eventid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static updateEvent(event) { 
    const {
      eventid,
      description,
      location,
      startdate,
      enddate,
      allday,
      repeat,
    } = event;

    return new Promise((resolve, reject) => {
      if (!eventid) return reject('eventid is null');
      pool.query(
        `UPDATE events SET
          description = $1,
          location = $2,
          startdate = $3,
          enddate = $4,
          allday = $5,
          repeat = $6
         WHERE id = $7`,
        [description,
          location,
          startdate,
          enddate,
          allday,
          repeat,
          eventid],
        (error, response) => {
          if (error) return reject(error);

          resolve({eventid});
        }
      )
    });
  }
}

module.exports = EventTable;
