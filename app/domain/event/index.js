const DEFAULT_PROPERTIES = {
    eventid: undefined,
    description: '',
    location: '',
    get startdate() {
      return new Date()
    },
    get enddate() {
      return new Date()
    },
    allday: false,
    repeat: 'none',
    members: [],
    groups: []
}

class Event {
  constructor({
    eventid,
    description,
    location,
    startdate,
    enddate,
    allday,
    repeat,
    members,
    groups
  } = {}) {
    this.eventid = eventid || DEFAULT_PROPERTIES.eventid;
    this.description = description || DEFAULT_PROPERTIES.description;
    this.location = location || DEFAULT_PROPERTIES.location;
    this.startdate = startdate || DEFAULT_PROPERTIES.startdate;
    this.enddate = enddate || DEFAULT_PROPERTIES.enddate;
    this.allday = allday || DEFAULT_PROPERTIES.allday;
    this.repeat = repeat || DEFAULT_PROPERTIES.repeat;
    this.members = members || DEFAULT_PROPERTIES.members;
    this.groups = groups || DEFAULT_PROPERTIES.groups;
  }
}

module.exports = Event;