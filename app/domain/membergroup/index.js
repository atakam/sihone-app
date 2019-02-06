const DEFAULT_PROPERTIES = {
    memberid: undefined,
    groupid: undefined
}

class MemberGroup {
  constructor({
    memberid,
    groupid
  } = {}) {
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.groupid = groupid || DEFAULT_PROPERTIES.groupid;
  }
}

module.exports = MemberGroup;