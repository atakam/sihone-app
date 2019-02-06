const DEFAULT_PROPERTIES = {
    groupid: undefined,
    smsid: false
}

class GroupSms {
  constructor({
    groupid,
    smsid,
    issent
  } = {}) {
    this.groupid = groupid || DEFAULT_PROPERTIES.groupid;
    this.smsid = smsid || DEFAULT_PROPERTIES.smsid;
    this.issent = issent || DEFAULT_PROPERTIES.issent;
  }
}

module.exports = GroupSms;