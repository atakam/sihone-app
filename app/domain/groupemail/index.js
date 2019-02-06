const DEFAULT_PROPERTIES = {
    groupid: undefined,
    emailid: undefined,
    issent: false
}

class GroupEmail {
  constructor({
    groupid,
    emailid,
    issent
  } = {}) {
    this.groupid = groupid || DEFAULT_PROPERTIES.groupid;
    this.emailid = emailid || DEFAULT_PROPERTIES.emailid;
    this.issent = issent || DEFAULT_PROPERTIES.issent;
  }
}

module.exports = GroupEmail;