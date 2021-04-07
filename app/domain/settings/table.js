const pool = require('../../../databasePool');

class SettingsTable {

  static getSetting(tablename) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          ${tablename}
        FROM settings`,
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no settings found'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getSettings() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          *
        FROM settings`,
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error('no settings found'));

          resolve(response.rows[0]);
        }
      )
    });
  }

  static getCounts() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
          (SELECT COUNT(*) FROM members WHERE active = true) AS member,
          (SELECT COUNT(*) FROM   groups) AS group,
          (SELECT COUNT(*) FROM (SELECT DISTINCT families.id FROM families LEFT JOIN members ON members.familyid = families.id WHERE members.id IS NOT NULL AND members.active = true) AS ufamily) AS family,
          (SELECT COUNT(*) FROM members WHERE (birthdate > NOW() - interval '18 year') AND active = true) AS children
        FROM settings`,
        (error, response) => {
          if (error) return reject(error);
          console.log('COUNT:', response.rows)
          resolve({
            member: response.rows[0].member,
            group: response.rows[0].group,
            family: response.rows[0].family,
            children: response.rows[0].children
          });
        }
      )
    });
  }

  static updateSettings(settings) { 
    const {
      churchname,
        charitynumber,
        streetaddress,
        city,
        province,
        postalcode,
        country,
        currency,
        phone,
        email,
        website,
        welcome,
        smtphost,
        smtpport,
        smtpuser,
        smtppass,
        smtpemail,
        smtpname,
        smtpsecure,
        emailfooter,
        smsapikey,
        smsapisecret,
        smsnumber,
        smsbalance,
        memberidprefix,
        memberidlength,
        memberidautomate,
        memberdefaultpassword
    } = settings

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          churchname = $1,
          charitynumber = $2,
          streetaddress = $3,
          city = $4,
          province = $5,
          postalcode = $6,
          country = $7,
          currency = $8,
          phone = $9,
          email = $10,
          website = $11,
          welcome = $12,
          smtphost = $13,
          smtpport = $14,
          smtpuser = $15,
          smtppass = $16,
          smtpemail = $17,
          smtpname = $18,
          smtpsecure = $16,
          emailfooter = $20,
          smsapikey = $21,
          smsapisecret = $22,
          smsnumber = $23,
          smsbalance = $24,
          memberidprefix = $25,
          memberidlength = $26,
          memberidautomate = $27,
          memberdefaultpassword = $28`,
        [ churchname,
          charitynumber,
          streetaddress,
          city,
          province,
          postalcode,
          country,
          currency,
          phone,
          email,
          website,
          welcome,
          smtphost,
          smtpport,
          smtpuser,
          smtppass,
          smtpemail,
          smtpname,
          smtpsecure,
          emailfooter,
          smsapikey,
          smsapisecret,
          smsnumber,
          smsbalance,
          memberidprefix,
          memberidlength,
          memberidautomate,
          memberdefaultpassword],
        (error, response) => {
          if (error) return reject(error);
          console.log('response', response);
          resolve(true);
        }
      )
    });
  }

  static updateLogoSettings(logo){
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          logo = $1`,
        [logo],
        (error, response) => {
          if (error) return reject(error);
          console.log('response', response);
          resolve(true);
        }
      )
    });
  }

  static updateIdentitySettings(settings) { 
    const {
      churchname,
        charitynumber,
        streetaddress,
        city,
        province,
        postalcode,
        country,
        currency,
        phone,
        email,
        website,
        welcome
    } = settings

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          churchname = $1,
          charitynumber = $2,
          streetaddress = $3,
          city = $4,
          province = $5,
          postalcode = $6,
          country = $7,
          currency = $8,
          phone = $9,
          email = $10,
          website = $11,
          welcome = $12`,
        [ churchname,
          charitynumber,
          streetaddress,
          city,
          province,
          postalcode,
          country,
          currency,
          phone,
          email,
          website,
          welcome],
        (error, response) => {
          if (error) return reject(error);
          console.log('response', response);
          resolve(true);
        }
      )
    });
  }

  static updateEmailSettings(settings) { 
    const {
      smtpname,
      smtpemail,
      smtphost,
      smtpuser,
      smtppass,
      smtpport,
      smtpsecure,
      emailfooter
    } = settings

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          smtphost = $1,
          smtpport = $2,
          smtpuser = $3,
          smtppass = $4,
          smtpemail = $5,
          smtpname = $6,
          smtpsecure = $7,
          emailfooter = $8`,
        [ smtphost,
          smtpport,
          smtpuser,
          smtppass,
          smtpemail,
          smtpname,
          smtpsecure,
          emailfooter],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static updateSmsSettings(settings) { 
    const {
      smsapikey,
      smsapisecret,
      smsnumber
    } = settings

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          smsapikey = $1,
          smsapisecret = $2,
          smsnumber = $3`,
        [ smsapikey,
          smsapisecret,
          smsnumber],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static updateStreamSettings(settings) { 
    const {
      youtube,
      facebook
    } = settings;

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          youtube = $1,
          facebook = $2`,
        [ youtube,
          facebook ],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static updateSmsBalance(settings) { 
    const {
      smsbalance
    } = settings

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          smsbalance = $1`,
        [ smsbalance ],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }

  static updateMemberSettings(settings) { 
    const {
      memberidprefix,
      memberidlength,
      memberidautomate,
      memberdefaultpassword
    } = settings

    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE settings SET
          memberidprefix = $1,
          memberidlength = $2,
          memberidautomate = $3,
          memberdefaultpassword = $4`,
        [ memberidprefix,
          memberidlength,
          memberidautomate,
          memberdefaultpassword],
        (error, response) => {
          if (error) return reject(error);
          resolve(true);
        }
      )
    });
  }
}

module.exports = SettingsTable;
