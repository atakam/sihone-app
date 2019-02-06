const DEFAULT_PROPERTIES = {
    reportid: undefined,
    querystring: '',
    get reportdate() {
      return new Date()
    }
}

class Report {
  constructor({
    reportid,
    querystring,
    reportdate
  } = {}) {
    this.reportid = reportid || DEFAULT_PROPERTIES.reportid;
    this.querystring = querystring || DEFAULT_PROPERTIES.querystring;
    this.reportdate = reportdate || DEFAULT_PROPERTIES.reportdate;
  }
}

module.exports = Report;