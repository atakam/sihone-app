const DEFAULT_PROPERTIES = {
    emailid: undefined,
    subject: '',
    emailtext: '',
    get emaildate() {
      return new Date()
    },
    members: [],
    groups: []
}

class Email {
  constructor({
    emailid,
    subject,
    emailtext,
    emaildate,
    members,
    groups
  } = {}) {
    this.emailid = emailid || DEFAULT_PROPERTIES.emailid;
    this.subject = subject || DEFAULT_PROPERTIES.subject;
    this.emailtext = emailtext || DEFAULT_PROPERTIES.emailtext;
    this.emaildate = emaildate || DEFAULT_PROPERTIES.emaildate;
    this.members = members || DEFAULT_PROPERTIES.members;
    this.groups = groups || DEFAULT_PROPERTIES.groups;
  }
}

module.exports = Email;