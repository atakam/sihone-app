const DEFAULT_PROPERTIES = {
    donationid: undefined,
    fundid: undefined,
    amount: 0
}

class DonationFund {
  constructor({
    donationid,
    fundid,
    amount
  } = {}) {
    this.donationid = donationid || DEFAULT_PROPERTIES.donationid;
    this.fundid = fundid || DEFAULT_PROPERTIES.fundid;
    this.amount = amount || DEFAULT_PROPERTIES.amount;
  }
}

module.exports = DonationFund;