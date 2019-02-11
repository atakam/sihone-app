const pool = require('../../../databasePool');

class FamilyTable {
  static addFamily(family) {
    const { 
      familyname,
      email,
      phone,
      streetaddress,
      city,
      province,
      postalcode,
      country
     } = family;

    return new Promise((resolve, reject) => {
      if (family.familyid) resolve({ familyid });
      pool.query(
        `INSERT INTO families(
          familyname,
          email,
          phone,
          streetaddress,
          city,
          province,
          postalcode,
          country
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          familyname,
          email,
          phone,
          streetaddress,
          city,
          province,
          postalcode,
          country
        ],
        (error, response) => {
          if (error) return reject(error);

          const familyid = response.rows[0].id;
          resolve({ familyid });
        }
      )
    });
  }

  static addFamilies(families) {
    return new Promise((resolve, reject) => {
      const familiyids = [];
      families.map((family) => {
        const { 
          familyname,
          email,
          phone,
          streetaddress,
          city,
          province,
          postalcode,
          country
         } = family;

         if (family.familyid) resolve({ familyid });
          pool.query(
            `INSERT INTO families(
              familyname,
              email,
              phone,
              streetaddress,
              city,
              province,
              postalcode,
              country
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
              familyname,
              email,
              phone,
              streetaddress,
              city,
              province,
              postalcode,
              country
            ],
            (error, response) => {
              if (error) return reject(error);

              const familyid = response.rows[0].id;
              familiyids.push({ familyid });
            }
          )
      })
      resolve(familiyids);
    });
  }

  static getFamily(familyid) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          id,
          familyname,
          email,
          phone,
          streetaddress,
          city,
          province,
          postalcode,
          country
        FROM families
        WHERE families.id = $1`,
        [familyid],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no family'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getFamilies() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          families.id,
          familyname,
          families.email,
          families.phone,
          streetaddress,
          city,
          province,
          postalcode,
          country,
          members.id as memberid
        FROM families
        LEFT JOIN members ON members.familyid = families.id
        WHERE members.id > 0 AND members.active = true`,
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows);
        }
      )
    });
  }

  static updateFamily(family) { 
    const {
      familyid,
      familyname,
      email,
      phone,
      streetaddress,
      city,
      province,
      postalcode,
      country
    } = family

    return new Promise((resolve, reject) => {
      if (!familyid) return reject('familyid is null');
      pool.query(
        `UPDATE families SET
          familyname = $1,
          email = $2,
          phone = $3,
          streetaddress = $4,
          city = $5,
          province = $6,
          postalcode = $7,
          country = $8
         WHERE id = $9`,
        [ familyname,
          email,
          phone,
          streetaddress,
          city,
          province,
          postalcode,
          country,
          familyid],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      )
    });
  }

  static deleteFamily({ familyid }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM families
        WHERE families.id = $1`,
        [familyid],
        (error, response) => {
          if (error) return reject(error);

          resolve(true);
        }
      )
    });
  }
}

module.exports = FamilyTable;
