const pool = require('../../../databasePool');

class EmailTable {
  static addEmail(email) {
    const {
      subject,
      emailtext,
      emaildate
     } = email;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO emails(
          subject,
          emailtext,
          emaildate
        ) VALUES($1, $2, $3) RETURNING id`,
        [
          subject,
          emailtext,
          emaildate
        ],
        (error, response) => {
          if (error) return reject(error);

          resolve({ emailid: response.rows[0].id});
        }
      )
    });
  }

  static getEmail({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          emailtext,
          emaildate
        FROM emails
        WHERE emails.id = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no email'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getAllEmail() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          emails.id,
          emails.subject,
          emailtext,
          emaildate,
          emails.specials,
          firstname,
          lastname,
          groupname
        FROM emails
        LEFT JOIN memberemail ON emails.id = memberemail.emailid
        LEFT JOIN members ON memberemail.memberid = members.id
        LEFT JOIN groupemail ON emails.id = groupemail.emailid
        LEFT JOIN groups ON groupemail.groupid = groups.id
        ORDER BY emaildate DESC`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static addSpecialEmail({specials, emailid}) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE emails SET
          specials = $1
         WHERE id = $2`,
        [
          specials,
          emailid],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      );
    });
  }

  static deleteEmail({ emailid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM emails
        WHERE emails.id = $1`,
        [emailid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = EmailTable;
