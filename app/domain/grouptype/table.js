const pool = require('../../../databasePool');

class GroupTypeTable {
  static addGroupType(grouptypeobj) {
    const {
      grouptype
     } = grouptypeobj;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO grouptypes(
          grouptype
        ) VALUES($1) RETURNING id`,
        [
          grouptype
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ grouptypeid: response.rows[0].id});
        }
      )
    });
  }

  static getGroupType({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          grouptype
        FROM grouptypes
        WHERE grouptypes.id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return;

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getGroupTypeName({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          grouptype
        FROM grouptypes
        WHERE grouptypes.id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return;

          resolve(response.rows[0].grouptype);
        }
      )
    });
  }

  static getGroupTypes() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          grouptype
        FROM grouptypes`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateGroupType(grouptypeobj) { 
    const {
      grouptypeid,
      grouptype
    } = grouptypeobj

    return new Promise((resolve, reject) => {
      if (!grouptypeid) return reject('grouptypeid is null');
      pool.query(
        `UPDATE grouptypes SET grouptype = $1 WHERE id = $2`,
        [grouptype, grouptypeid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static deleteGroupType({ grouptypeid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM grouptypes
        WHERE grouptypes.id = $1`,
        [grouptypeid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = GroupTypeTable;
