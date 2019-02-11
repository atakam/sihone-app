const DEFAULT_PROPERTIES = {
    donationid: undefined,
    envelopeid: undefined,
    memberid: undefined,
    paytype: undefined,
    get paydate() {
      return new Date()
    },
    checknumber: undefined,
    donationfunds: []
}

class Donation {
  constructor({
    donationid,
    envelopeid,
    memberid,
    paytype,
    paydate,
    checknumber,
    donationfunds
  } = {}) {
    this.donationid = donationid || DEFAULT_PROPERTIES.donationid;
    this.envelopeid = envelopeid || DEFAULT_PROPERTIES.envelopeid;
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.paytype = paytype || DEFAULT_PROPERTIES.paytype;
    this.paydate = paydate || DEFAULT_PROPERTIES.paydate;
    this.checknumber = checknumber || DEFAULT_PROPERTIES.checknumber;
    this.donationfunds = donationfunds || DEFAULT_PROPERTIES.donationfunds;
  }
}

module.exports = Donation;