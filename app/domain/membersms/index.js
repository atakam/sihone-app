const DEFAULT_PROPERTIES = {
    memberid: undefined,
    smsid: false
}

class MemberSms {
  constructor({
    memberid,
    smsid,
    issent
  } = {}) {
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.smsid = smsid || DEFAULT_PROPERTIES.smsid;
    this.issent = issent || DEFAULT_PROPERTIES.issent;
  }
}

module.exports = MemberSms;