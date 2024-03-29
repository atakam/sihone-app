const {v4: uuidv4} = require('uuid');
const { hash } = require('./helper');

const SEPARATOR = '|';

class Session {
  constructor({ email }) {
    this.email = email;
    this.id = uuidv4()
  }

  toString() {
    const { email, id } = this;

    return Session.sessionString({ email, id });
  }

  static parse(sessionString) {
    const sessionData = sessionString.split(SEPARATOR);

    return {
      email: sessionData[0],
      id: sessionData[1],
      sessionHash: sessionData[2]
    };
  }

  static verify(sessionString) {
    const { email, id, sessionHash } = Session.parse(sessionString);

    const accountData = Session.accountData({ email, id });

    return hash(accountData) === sessionHash;
  }

  static accountData({ email, id }) {
    return `${email}${SEPARATOR}${id}`;
  }

  static sessionString({ email, id }) {
    const accountData = Session.accountData({ email, id });

    return `${accountData}${SEPARATOR}${hash(accountData)}`;
  }
}

module.exports = Session;