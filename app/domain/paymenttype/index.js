const DEFAULT_PROPERTIES = {
    paymenttypeid: undefined,
    paymenttype: ''
}

class PaymentType {
  constructor({
    paymenttypeid,
    paymenttype
  } = {}) {
    this.paymenttypeid = paymenttypeid || DEFAULT_PROPERTIES.paymenttypeid;
    this.paymenttype = paymenttype || DEFAULT_PROPERTIES.paymenttype;
  }
}

module.exports = PaymentType;