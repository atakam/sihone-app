const COUNTRIES = require('../../../data/countries');

const DEFAULT_PROPERTIES = {
    familyid: undefined,
    familyname: '',
    email: '',
    phone: '',
    streetaddress: '',
    city: '',
    province: '',
    postalcode: '',
    get country() {
      let value = undefined;
      COUNTRIES.forEach(COUNTRY => {
          if (COUNTRY.key === 'CA') {
              value = COUNTRY.value;
          }
      });
      return value;
  },
}

class Family {
  constructor({
    familyid,
    familyname,
    email,
    phone,
    streetaddress,
    city,
    province,
    postalcode,
    country
  } = {}) {
    this.familyid = familyid || DEFAULT_PROPERTIES.familyid;
    this.familyname = familyname || DEFAULT_PROPERTIES.familyname;
    this.email = email || DEFAULT_PROPERTIES.email;
    this.phone = phone || DEFAULT_PROPERTIES.phone;
    this.streetaddress = streetaddress || DEFAULT_PROPERTIES.streetaddress;
    this.city = city || DEFAULT_PROPERTIES.city;
    this.province = province || DEFAULT_PROPERTIES.province;
    this.postalcode = postalcode || DEFAULT_PROPERTIES.postalcode;
    this.country = country || DEFAULT_PROPERTIES.country;
  }
}

module.exports = Family;