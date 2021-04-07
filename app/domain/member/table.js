const pool = require('../../../databasePool');

class MemberTable {
  static addMember(member) {
    const { 
      memberuid,
      firstname,
      lastname,
      gender,
      birthdate,
      marital,
      email,
      phone,
      familyid,
      familyrole,
      memberrole,
      membershipdate,
      baptismdate,
      access,
      avatar,
      hearaboutus,
      subscribtion,
      active,
      password
     } = member;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO members(
          memberuid,
          firstname,
          lastname,
          gender,
          birthdate,
          marital,
          email,
          phone,
          familyid,
          familyrole,
          memberrole,
          membershipdate,
          baptismdate,
          access,
          avatar,
          hearaboutus,
          subscribtion,
          active,
          password
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id`,
        [
          memberuid,
          firstname,
          lastname,
          gender,
          birthdate,
          marital,
          email,
          phone,
          familyid,
          familyrole,
          memberrole,
          membershipdate,
          baptismdate,
          access,
          avatar,
          hearaboutus,
          subscribtion,
          active,
          password
        ],
        (error, response) => {
          if (error) return reject(error);

          const memberid = response.rows[0].id;
          resolve({ memberid });
        }
      )
    });
  }

  static getLastMember() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id
        FROM members
        ORDER BY ID DESC LIMIT 1`,
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no member'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getMember({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          memberuid,
          firstname,
          lastname,
          gender,
          birthdate,
          marital,
          email,
          phone,
          familyid,
          familyrole,
          memberrole,
          membershipdate,
          baptismdate,
          access,
          avatar,
          hearaboutus,
          subscribtion,
          active
        FROM members
        WHERE members.id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);

          console.log(id);

          if (response.rows.length === 0) return reject(new Error('no member'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getMemberByEmail({ email }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, password, sessionid, memberrole, firstname FROM members
         WHERE "email" = $1`,
        [email],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      )
    });
  }

  static getMembers(active) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          members.id,
          memberuid,
          firstname,
          lastname,
          gender,
          birthdate,
          marital,
          members.email,
          members.phone,
          familyid,
          familyrole,
          memberrole,
          membershipdate,
          baptismdate,
          access,
          avatar,
          hearaboutus,
          subscribtion,
          active,
          familyname,
          streetaddress,
          city,
          province,
          postalcode,
          country
        FROM members
        LEFT JOIN families ON families.id = familyid
        WHERE active = $1`,
        [active],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getMembersByFamilyId(familyId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          members.id,
          memberuid,
          firstname,
          lastname,
          gender,
          birthdate,
          marital,
          members.email,
          members.phone,
          familyid,
          familyrole,
          memberrole,
          membershipdate,
          baptismdate,
          access,
          avatar,
          hearaboutus,
          subscribtion,
          active
        FROM members
        WHERE familyid = $1`,
        [familyId],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getMembersByGroupId(groupId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          members.id,
          memberuid,
          firstname,
          lastname,
          gender,
          birthdate,
          marital,
          members.email,
          members.phone,
          familyid,
          familyrole,
          memberrole,
          membershipdate,
          baptismdate,
          access,
          avatar,
          hearaboutus,
          subscribtion,
          active
        FROM members
        LEFT JOIN membergroup ON membergroup.memberid = members.id
        WHERE membergroup.groupid = $1`,
        [groupId],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static getEmails(memberids) {
    return Promise.all(
      memberids.map((memberid) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT
              email
            FROM members
            WHERE id = $1`,
            [memberid],
            (error, response) => {
              if (error) return reject(error);
              resolve(response.rows[0].email);
            }
          )
        });
      })
    );
  }

  static getPhone(memberid) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          phone,
          active,
          subscribtion
        FROM members
        WHERE id = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows[0] ? response.rows[0] : null);
        }
      )
    });
  }

  static getPhonesFromSpecial(special) {
    return new Promise((resolve, reject) => {
      if (special === 'staff') {
        pool.query(
          `SELECT
            phone,
            active,
            subscribtion
          FROM members
          WHERE memberrole = $1 OR memberrole = $2 OR memberrole = $3 OR memberrole = $4`,
          ['administrator', 'assistant', 'accountant', 'group'],
          (error, response) => {
            if (error) return reject(error);
            response.rows.length === 0 && resolve('')
            response.rows.length > 0 && resolve(response.rows);
          }
        )
      } else if (special === 'members' || special === 'visitors') {
        pool.query(
          `SELECT
            phone
          FROM members
          WHERE memberrole = $1`,
          [special === 'members' ? 'member' : 'visitor'],
          (error, response) => {
            if (error) return reject(error);
            response.rows.length === 0 && resolve('')
            response.rows.length > 0 && resolve(response.rows.map((row) => row.phone));
          }
        )
      } else {
        pool.query(
          `SELECT
            *
          FROM members`,
          (error, response) => {
            if (error) return reject(error);
            response.rows.length === 0 && resolve('')
            response.rows.length > 0 && resolve(response.rows.map((row) => row.phone));
          }
        )
      }
      
    });
  }

  static getEmailsFromSpecials(specials) {
    return Promise.all(
      specials.map((special) => {
        return new Promise((resolve, reject) => {
          if (special === 'staff') {
            pool.query(
              `SELECT
                email
              FROM members
              WHERE (memberrole = $1 OR memberrole = $2 OR memberrole = $3 OR memberrole = $4)
              AND email IS NOT NULL AND subscribtion IS TRUE`,
              ['administrator', 'assistant', 'accountant', 'group'],
              (error, response) => {
                if (error) return reject(error);
                response.rows.length === 0 && resolve('')
                response.rows.length > 0 && resolve(response.rows.map((row) => row.email));
              }
            )
          } else if (special === 'members' || special === 'visitors') {
            pool.query(
              `SELECT
                email
              FROM members
              WHERE memberrole = $1 AND email IS NOT NULL AND subscribtion IS TRUE`,
              [special === 'members' ? 'member' : 'visitor'],
              (error, response) => {
                if (error) return reject(error);
                response.rows.length === 0 && resolve('')
                response.rows.length > 0 && resolve(response.rows.map((row) => row.email));
              }
            )
          } else {
            pool.query(
              `SELECT
                email
              FROM members WHERE email IS NOT NULL AND subscribtion IS TRUE`,
              (error, response) => {
                if (error) return reject(error);
                response.rows.length === 0 && resolve('')
                response.rows.length > 0 && resolve(response.rows.map((row) => row.email));
              }
            )
          }
          
        });
      })
    );
  }

  static updateMember(member) { 
    const {
      memberid,
      memberuid,
      firstname,
      lastname,
      gender,
      birthdate,
      marital,
      email,
      phone,
      familyid,
      familyrole,
      memberrole,
      membershipdate,
      baptismdate,
      access,
      avatar,
      hearaboutus,
      subscribtion,
      active,
      password
    } = member

    if (password) {
      return new Promise((resolve, reject) => {
        if (!memberid) return reject('memberid is null');
        pool.query(
          `UPDATE members SET
            firstname = $1,
            lastname = $2,
            gender = $3,
            birthdate = $4,
            marital = $5,
            email = $6,
            phone = $7,
            familyid = $8,
            familyrole = $9,
            memberrole = $10,
            membershipdate = $11,
            baptismdate = $12,
            access = $13,
            avatar = $14,
            hearaboutus = $15,
            subscribtion = $16,
            active = $17,
            memberuid = $18,
            password= $19
           WHERE id = $20`,
          [ firstname,
            lastname,
            gender,
            birthdate,
            marital,
            email,
            phone,
            familyid,
            familyrole,
            memberrole,
            membershipdate,
            baptismdate,
            access,
            avatar,
            hearaboutus,
            subscribtion,
            active,
            memberuid,
            password,
            memberid],
          (error, response) => {
            if (error) return reject(error);
  
            resolve();
          }
        )
      });
    } else {
      return new Promise((resolve, reject) => {
        if (!memberid) return reject('memberid is null');
        pool.query(
          `UPDATE members SET
            firstname = $1,
            lastname = $2,
            gender = $3,
            birthdate = $4,
            marital = $5,
            email = $6,
            phone = $7,
            familyid = $8,
            familyrole = $9,
            memberrole = $10,
            membershipdate = $11,
            baptismdate = $12,
            access = $13,
            avatar = $14,
            hearaboutus = $15,
            subscribtion = $16,
            active = $17,
            memberuid = $18
           WHERE id = $19`,
          [ firstname,
            lastname,
            gender,
            birthdate,
            marital,
            email,
            phone,
            familyid,
            familyrole,
            memberrole,
            membershipdate,
            baptismdate,
            access,
            avatar,
            hearaboutus,
            subscribtion,
            active,
            memberuid,
            memberid],
          (error, response) => {
            if (error) return reject(error);
  
            resolve();
          }
        )
      });
    }
  }

  static updatePassword ({email, password}) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE members SET
          password = $1
         WHERE email = $2`,
        [ password,
          email],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteMember({ memberid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM members
        WHERE members.id = $1`,
        [memberid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }

  static deleteGroupsByMember({ memberid }) {
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

  static updateSessionId({ sessionid, email }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE members SET "sessionid" = $1 WHERE "email" = $2',
        [sessionid, email],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }
}

module.exports = MemberTable;
