const pool = require('../../../databasePool');

class ReportTable {
  static runMember(request) {
    const {
      firstname,
      lastname,
      gender,
      birthdateto,
      birthdatefrom,
      marital,
      email,
      phone,
      uid,
      role,
      membershipdateto,
      membershipdatefrom,

      familyname,
      familyemail,
      streetaddress,
      city,
      province,
      postalcode,
      country,
      homephone,

      groupname,
      grouptype,

      firstNameCheck,
      lastNameCheck,
      genderCheck,
      birthCheck,
      maritalCheck,
      emailCheck,
      mobileCheck,
      muidCheck,
      roleCheck,
      memberDateCheck,

      fnameCheck,
      femailCheck,
      homePhoneCheck,
      streetCheck,
      cityCheck,
      provinceCheck,
      postalCheck,
      countryCheck,

      groupnameCheck,
      grouptypeCheck
    } = request;

    const options = [];
    const header = [];
    if (firstNameCheck === true) {
      options.push({
        column: 'members.firstname',
        where: firstname !== '' ? 'members.firstname LIKE \'%' + firstname + '%\'' : null
      });
      header.push('First Name');
    }
    if (lastNameCheck === true) {
      options.push({
        column: 'members.lastname',
        where: lastname !== '' ? 'members.lastname LIKE \'%' + lastname + '%\'' : null
      });
      header.push('Last Name');
    }
    if (genderCheck === true) {
      options.push({
        column: 'members.gender',
        where: gender && gender !== '' && gender !== 'any' ? 'members.gender LIKE \'%' + gender + '%\'' : null
      });
      header.push('Gender');
    }
    if (maritalCheck === true) {
      options.push({
        column: 'members.marital',
        where: marital && marital.length > 0 ? 'members.marital LIKE \'%' + marital + '%\'' : null
      });
      header.push('Marital Status');
    }
    if (emailCheck === true) {
      options.push({
        column: 'members.email',
        where: email !== '' ? 'members.email LIKE \'%' + email + '%\'' : null
      });
      header.push('Email');
    }
    if (mobileCheck === true) {
      options.push({
        column: 'members.phone',
        where: phone !== '' ? 'members.phone LIKE \'%' + phone + '%\'' : null
      });
      header.push('Mobile Phone');
    }
    if (muidCheck === true) {
      options.push({
        column: 'members.memberuid',
        where: uid !== '' ? 'members.memberuid LIKE \'%' + uid + '%\'' : null
      });
      header.push('Member ID');
    }
    if (roleCheck === true) {
      options.push({
        column: 'members.memberrole',
        where: role && role.length > 0 ? 'members.memberrole LIKE \'%' + role + '%\'' : null
      });
      header.push('Member Role');
    }
    if (birthCheck === true) {
      options.push({
        column: 'members.birthdate',
        where: (birthdatefrom && birthdateto) ? '(members.bithdate BETWEEN '+birthdatefrom+'::date AND '+birthdateto+'::date)': null
      });
      header.push('Birth Date');
    }
    if (memberDateCheck === true) {
      options.push({
        column: 'members.membershipdate',
        where: (membershipdatefrom && membershipdateto) ? '(members.membershipdate BETWEEN '+membershipdatefrom+'::date AND '+membershipdateto+'::date)': null
      });
      header.push('Membership Date');
    }
    if (fnameCheck === true) {
      options.push({
        column: 'families.familyname',
        where: familyname !== '' ? 'families.familyname LIKE \'%' + familyname + '%\'' : null
      });
      header.push('Family Name');
    }
    if (femailCheck === true) {
      options.push({
        column: 'families.email AS family_email',
        where: familyemail !== '' ? 'families.email LIKE \'%' + familyemail + '%\'' : null
      });
      header.push('Family Email');
    }
    if (homePhoneCheck === true) {
      options.push({
        column: 'families.streetaddress',
        where: streetaddress !== '' ? 'families.streetaddress LIKE \'%' + streetaddress + '%\'' : null
      });
      header.push('Street Address');
    }
    if (streetCheck === true) {
      options.push({
        column: 'families.city',
        where: city !== '' ? 'families.city LIKE \'%' + city + '%\'' : null
      });
      header.push('City');
    }
    if (cityCheck === true) {
      options.push({
        column: 'families.province',
        where: province !== '' ? 'families.province LIKE \'%' + province + '%\'' : null
      });
      header.push('Province');
    }
    if (provinceCheck === true) {
      options.push({
        column: 'families.postalcode',
        where: postalcode !== '' ? 'families.postalcode LIKE \'%' + postalcode + '%\'' : null
      });
      header.push('Postal Code');
    }
    if (postalCheck === true) {
      options.push({
        column: 'families.country',
        where: country !== '' ? 'families.country LIKE \'%' + country +  '%\'' : null
      });
      header.push('Country');
    }
    if (countryCheck === true) {
      options.push({
        column: 'families.phone AS home_phone',
        where: homephone !== '' ? 'families.phone LIKE \'%' + homephone + '%\'' : null
      });
      header.push('Home Phone');
    }
    if (groupnameCheck === true) {
      options.push({
        column: 'groups.groupname',
        where: groupname !== '' ? 'groups.groupname LIKE \'%' + groupname + '%\'' : null
      });
      header.push('Group Names');
      if (grouptypeCheck === true) {
        options.push({
          column: 'grouptypes.grouptype',
          where: groupname !== '' ? 'grouptypes.grouptype LIKE \'%' + grouptype + '%\'' : null
        });
        header.pop();
        header.push('Group Names (Group Type)');
      }
    }

    let selectString = '';
    let whereString = '';

    options.map((option, i) => {
      selectString += (i !== 0 ? ', ' : '') + option.column;
      whereString += whereString !== '' ? (option.where ? ' AND ' + option.where : '') : (option.where ? ' WHERE ' + option.where : '');
    });

    console.log(selectString);
    console.log(whereString); 

    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT members.id AS memberid, ${selectString} FROM members
         LEFT JOIN families ON families.id = familyid
         LEFT JOIN membergroup ON membergroup.memberid = members.id
         LEFT JOIN groups ON groups.id = membergroup.groupid
         LEFT JOIN grouptypes ON grouptypes.id = groups.grouptypeid
         ${whereString}`,
        (error, response) => {
          if (error) return reject(error);

          const mapped = [];
          const skipped = [];
          response.rows.map((row, i) => {
            response.rows.map((row2, j) => {
              if (i !== j && row.memberid === row2.memberid) {
                mapped.push({i, j});
                skipped.push(j);
              }
            });
          });

          console.log(mapped);

          const results = response.rows.map((row, i) => {
            row.groupname && row.grouptype && (row.groupname = row.groupname + '(' + row.grouptype + ')');
            delete row.grouptype;
            return row;
          });

          mapped.map(({i, j}) => {
            results[i].groupname && (results[i].groupname += ' | ' + results[j].groupname);
          })

          const results2 = results.map((row, i) => {
            delete row.memberid;
            if (!skipped.includes(i))
              return row;
          });
          const filteredResults = results2.filter(function (el) {
            return el != null;
          });
          resolve({report: filteredResults, header});
        }
      )
    });
  }

  static runDonation(request) {
    const {
      firstname,
      lastname,
      paydatefrom,
      paydateto,
      paytype,
      fundname,
      amountfrom,
      amountto,
      envelope,
      envelope_status,
      envelope_datefrom,
      envelope_dateto,
      account,

      firstNameCheck,
      lastNameCheck,
      paydateCheck,
      paytypeCheck,
      fundnameCheck,
      amountCheck,
      envelopeCheck,
      envelope_statusCheck,
      envelope_dateCheck,
      accountCheck
    } = request;

    const options = [];
    const header = [];
    if (firstNameCheck === true) {
      options.push({
        column: 'members.firstname',
        where: firstname !== '' ? 'members.firstname LIKE \'%' + firstname + '%\'' : null
      });
      header.push('First Name');
    }
    if (lastNameCheck === true) {
      options.push({
        column: 'members.lastname',
        where: lastname !== '' ? 'members.lastname LIKE \'%' + lastname + '%\'' : null
      });
      header.push('Last Name');
    }
    if (paydateCheck === true) {
      options.push({
        column: 'donations.paydate',
        where: (paydatefrom && paydateto) ? '(donations.paydate BETWEEN '+paydatefrom+'::date AND '+paydateto+'::date)': null
      });
      header.push('Payment Date');
    }
    if (paytypeCheck === true) {
      options.push({
        column: 'paymenttypes.paymenttype',
        where: paytype && paytype !== '' ? 'paymenttypes.paymenttype LIKE \'%' + paytype + '%\'' : null
      });
      header.push('Payment Tyoe');
    }
    if (fundnameCheck === true) {
      options.push({
        column: 'funds.fundname',
        where: fundname !== '' ? 'funds.fundname LIKE \'%' + fundname + '%\'' : null
      });
      header.push('Fund Name');
    }
    if (amountCheck === true) {
      options.push({
        column: 'donationfund.amount',
        where: (amountfrom && amountto) ? '(donationfund.amount BETWEEN '+amountfrom+' AND '+amountto+')': null
      });
      header.push('Amount');
    }
    if (envelopeCheck === true) {
      options.push({
        column: 'envelopes.descriptiontext AS envelope',
        where: envelope !== '' ? 'envelopes.descriptiontext LIKE \'%' + envelope + '%\'' : null
      });
      header.push('Envelope');
    }
    if (envelope_dateCheck === true) {
      options.push({
        column: 'envelopes.envelopedate',
        where: (envelope_datefrom && envelope_dateto) ? '(envelopes.envelopedate BETWEEN '+envelope_datefrom+'::date AND '+envelope_dateto+'::date)': null
      });
      header.push('Envelope Date');
    }
    if (envelope_statusCheck === true) {
      options.push({
        column: 'envelopes.isopen',
        where: envelope_status && envelope_status !== '' ? 'envelopes.isopen LIKE \'%' + envelope_status + '%\'' : null
      });
      header.push('Envelope Open State');
    }
    if (accountCheck === true) {
      options.push({
        column: 'accounts.descriptiontext AS account',
        where: account && account !== '' ? 'accounts.descriptiontext LIKE \'%' + account + '%\'' : null
      });
      header.push('Account');
    }

    let selectString = '';
    let whereString = '';

    options.map((option, i) => {
      selectString += (i !== 0 ? ', ' : '') + option.column;
      whereString += whereString !== '' ? (option.where ? ' AND ' + option.where : '') : (option.where ? ' WHERE ' + option.where : '');
    });

    console.log(selectString);
    console.log(whereString);

    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT ${selectString} FROM donations
         LEFT JOIN members ON members.id = donations.memberid
         LEFT JOIN paymenttypes ON paymenttypes.id = donations.paytype
         LEFT JOIN donationfund ON donationfund.donationid = donations.id
         LEFT JOIN funds ON funds.id = donationfund.fundid
         LEFT JOIN envelopes ON envelopes.id = donations.envelopeid
         LEFT JOIN accounts ON accounts.id = envelopes.accountid
         ${whereString}`,
        (error, response) => {
          if (error) return reject(error);

          const results = response.rows.map((row) => {
            
            if (row.paydate) {
              const p_date = (row.paydate + '').split(' ');
              row.paydate = p_date[0] + ' ' + p_date[1] + ' ' + p_date[2] + ' ' + p_date[3];
            }
            if (row.envelopedate) {
              row.envelopedate = (row.envelopedate + '').split('T')[0];
            }
            console.log(row);
            return row;
          });

          resolve({report: results, header});
        }
      )
    });
  }

  static runAccount(request) {
    const {
      description,
      transactiontype,
      transactiondatefrom,
      transactiondateto,
      amountfrom,
      amountto,

      descriptionCheck,
      transactiontypeCheck,
      transactiondateCheck,
      amountCheck
    } = request;

    const options = [];
    const header = [];
    if (descriptionCheck === true) {
      options.push({
        column: 'transactions.descriptiontext AS transaction',
        where: description !== '' ? 'transactions.descriptiontext LIKE \'%' + description + '%\'' : null
      });
      header.push('Description');
    }
    if (transactiontypeCheck === true) {
      options.push({
        column: 'transactions.transactiontype',
        where: transactiontype !== '' ? 'transactions.transactiontype LIKE \'%' + transactiontype + '%\'' : null
      });
      header.push('Transaction Type');
    }
    if (transactiondateCheck === true) {
      options.push({
        column: 'transactions.transactiondate',
        where: (transactiondatefrom && transactiondateto) ? '(transactions.transactiondate BETWEEN '+transactiondatefrom+'::date AND '+transactiondateto+'::date)': null
      });
      header.push('Transaction Date');
    }
    if (amountCheck === true) {
      options.push({
        column: 'transactions.amount',
        where: (amountfrom && amountto) ? '(transactions.amount BETWEEN '+amountfrom+' AND '+amountto+')': null
      });
      header.push('Amount');
    }

    let selectString = '';
    let whereString = '';

    options.map((option, i) => {
      selectString += (i !== 0 ? ', ' : '') + option.column;
      whereString += whereString !== '' ? (option.where ? ' AND ' + option.where : '') : (option.where ? ' WHERE ' + option.where : '');
    });

    console.log(selectString);
    console.log(whereString);

    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT ${selectString} FROM transactions
         ${whereString}`,
        (error, response) => {
          if (error) return reject(error);

          const results = response.rows.map((row) => {
            if (row.transactiontype && row.transactiontype==='expense') {
              row.amount && (
                row.amount = '(' + row.amount + ')'
              );
            }
            if (row.transactiondate) {
              const t_date = (row.transactiondate + '').split(' ');
              row.transactiondate = t_date[0] + ' ' + t_date[1] + ' ' + t_date[2] + ' ' + t_date[3];
            }
            return row;
          });

          resolve({report: results, header});
        }
      )
    });
  }
}

module.exports = ReportTable;
