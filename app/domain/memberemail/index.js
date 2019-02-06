const DEFAULT_PROPERTIES = {
    memberid: undefined,
    emailid: undefined,
    issent: false
}

class MemberEmail {
  constructor({
    memberid,
    emailid,
    issent
  } = {}) {
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.emailid = emailid || DEFAULT_PROPERTIES.emailid;
    this.issent = issent || DEFAULT_PROPERTIES.issent;
  }
}

module.exports = MemberEmail;