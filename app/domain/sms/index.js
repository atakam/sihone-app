const DEFAULT_PROPERTIES = {
    smsid: undefined,
    smstext: '',
    get smsdate() {
      return new Date()
    },
    members: [],
    special: ''
}

class Sms {
  constructor({
    smsid,
    smstext,
    smsdate,
    members,
    special
  } = {}) {
    this.smsid = smsid || DEFAULT_PROPERTIES.smsid;
    this.smstext = smstext || DEFAULT_PROPERTIES.smstext;
    this.smsdate = smsdate || DEFAULT_PROPERTIES.smsdate;
    this.members = members || DEFAULT_PROPERTIES.members;
    this.special = special || DEFAULT_PROPERTIES.special;
  }
}

module.exports = Sms;