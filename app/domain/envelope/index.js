const DEFAULT_PROPERTIES = {
    envelopeid: undefined,
    descriptiontext: '',
    get envelopedate() {
      return new Date()
    },
    isopen: true,
    accountid: null
}

class Envelope {
  constructor({
    envelopeid,
    descriptiontext,
    envelopedate,
    isopen,
    accountid
  } = {}) {
    this.envelopeid = envelopeid || DEFAULT_PROPERTIES.envelopeid;
    this.descriptiontext = descriptiontext || DEFAULT_PROPERTIES.descriptiontext;
    this.envelopedate = envelopedate || DEFAULT_PROPERTIES.envelopedate;
    this.isopen = isopen || DEFAULT_PROPERTIES.isopen;
    this.accountid = accountid || DEFAULT_PROPERTIES.accountid;
  }
}

module.exports = Envelope;