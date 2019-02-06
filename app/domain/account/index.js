const DEFAULT_PROPERTIES = {
    accountid: undefined,
    descriptiontext: '',
    get accountdate() {
      return new Date()
    },
    isopen: true,
    candelete: true
}

class Account {
  constructor({
    accountid,
    descriptiontext,
    accountdate,
    isopen,
    candelete
  } = {}) {
    this.accountid = accountid || DEFAULT_PROPERTIES.accountid;
    this.descriptiontext = descriptiontext || DEFAULT_PROPERTIES.descriptiontext;
    this.accountdate = accountdate || DEFAULT_PROPERTIES.accountdate;
    this.isopen = isopen || DEFAULT_PROPERTIES.isopen;
    this.candelete = candelete || DEFAULT_PROPERTIES.candelete;
  }
}

module.exports = Account;