const DEFAULT_PROPERTIES = {
    groupid: undefined,
    eventid: undefined,
}

class GroupEmail {
  constructor({
    groupid,
    eventid
  } = {}) {
    this.groupid = groupid || DEFAULT_PROPERTIES.groupid;
    this.eventid = eventid || DEFAULT_PROPERTIES.eventid;
  }
}

module.exports = GroupEmail;