const pool = require('../../../databasePool');

class ActivityTable {
  static addActivity(activity) {
    const {
      descriptiontext,
      activitydate,
      memberid
     } = activity;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO activities(
          descriptiontext,
          activitydate,
          memberid
        ) VALUES($1, $2, $3) RETURNING id`,
        [
          descriptiontext,
          activitydate,
          memberid
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ activityid: response.rows[0].id});
        }
      )
    });
  }

  static getActivitys() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          activities.id,
          descriptiontext,
          activitydate,
          memberid,
          firstname,
          lastname
        FROM activities
        LEFT JOIN members ON members.id = activities.memberid`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static deleteActivity({ activityid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM activities
        WHERE activities.id = $1`,
        [activityid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = ActivityTable;
