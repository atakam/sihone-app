class Settings {
  constructor({
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
    logo,
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
  } = {}) {
    this.churchname = churchname;
    this.charitynumber = charitynumber;
    this.streetaddress = streetaddress;
    this.city = city;
    this.province = province;
    this.postalcode = postalcode;
    this.country = country;
    this.currency = currency;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.logo = logo;
    this.welcome = welcome;
    this.smtphost = smtphost;
    this.smtpport = smtpport;
    this.smtpuser = smtpuser;
    this.smtppass = smtppass;
    this.smtpemail = smtpemail;
    this.smtpname = smtpname;
    this.smtpsecure = smtpsecure;
    this.emailfooter = emailfooter;
    this.smsapikey = smsapikey;
    this.smsapisecret = smsapisecret;
    this.smsnumber = smsnumber;
    this.smsbalance = smsbalance;
    this.memberidprefix = memberidprefix;
    this.memberidlength = memberidlength;
    this.memberidautomate = memberidautomate;
    this.memberdefaultpassword = memberdefaultpassword;
  }
}

module.exports = Settings;