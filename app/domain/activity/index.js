const DEFAULT_PROPERTIES = {
    activityid: undefined,
    descriptiontext: '',
    get activitydate() {
      return new Date()
    },
    memberid: undefined
}

class Activity {
  constructor({
    activityid,
    descriptiontext,
    activitydate,
    memberid
  } = {}) {
    this.activityid = activityid || DEFAULT_PROPERTIES.activityid;
    this.descriptiontext = descriptiontext || DEFAULT_PROPERTIES.descriptiontext;
    this.activitydate = activitydate || DEFAULT_PROPERTIES.activitydate;
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
  }
}

module.exports = Activity;