const DEFAULT_PROPERTIES = {
    grouptypeid: undefined,
    grouptype: ''
}

class GroupType {
  constructor({
    grouptypeid,
    grouptype
  } = {}) {
    this.grouptypeid = grouptypeid || DEFAULT_PROPERTIES.grouptypeid;
    this.grouptype = grouptype || DEFAULT_PROPERTIES.grouptype;
  }
}

module.exports = GroupType;