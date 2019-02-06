const DEFAULT_PROPERTIES = {
    fundid: undefined,
    fundname: ''
}

class Fund {
  constructor({
    fundid,
    fundname
  } = {}) {
    this.fundid = fundid || DEFAULT_PROPERTIES.fundid;
    this.fundname = fundname || DEFAULT_PROPERTIES.fundname;
  }
}

module.exports = Fund;