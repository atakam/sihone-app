const DEFAULT_PROPERTIES = {
    groupid: undefined,
    groupname: '',
    grouptypeid: undefined
}

class Group {
  constructor({
    groupid,
    groupname,
    grouptypeid
  } = {}) {
    this.groupid = groupid || DEFAULT_PROPERTIES.groupid;
    this.groupname = groupname || DEFAULT_PROPERTIES.groupname;
    this.grouptypeid = grouptypeid || DEFAULT_PROPERTIES.grouptypeid;
  }
}

module.exports = Group;