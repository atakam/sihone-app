const TRAITS = require('../../../data/traits');

const DEFAULT_PROPERTIES = {
    transactionid: undefined,
    accountid: undefined,
    get transactiontype() {
      let value = undefined;
      TRAITS.forEach(TRAIT => {
          if (TRAIT.type === 'transactiontypes') {
              value = TRAIT.values[0].value;
          }
      });
      return value;
    },
    get transactiondate() {
      return new Date()
    },
    amount: 0,
    descriptiontext: ''
}

class Transaction {
  constructor({
    transactionid,
    accountid,
    memberid,
    transactiontype,
    transactiondate,
    amount,
    descriptiontext
  } = {}) {
    this.transactionid = transactionid || DEFAULT_PROPERTIES.transactionid;
    this.accountid = accountid || DEFAULT_PROPERTIES.accountid;
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.transactiontype = transactiontype || DEFAULT_PROPERTIES.transactiontype;
    this.transactiondate = transactiondate || DEFAULT_PROPERTIES.transactiondate;
    this.amount = amount || DEFAULT_PROPERTIES.amount;
    this.descriptiontext = descriptiontext || DEFAULT_PROPERTIES.descriptiontext;
  }
}

module.exports = Transaction;