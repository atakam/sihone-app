const DEFAULT_PROPERTIES = {
    memberid: undefined,
    eventid: undefined
}

class MemberEvent {
  constructor({
    memberid,
    eventid
  } = {}) {
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.eventid = eventid || DEFAULT_PROPERTIES.eventid;
  }
}

module.exports = MemberEvent;