CREATE TABLE IF NOT EXISTS families(
  id               SERIAL PRIMARY KEY,
  familyname       VARCHAR(64),
  email            VARCHAR(64),
  phone            VARCHAR(64),
  streetaddress    VARCHAR(64),
  city             VARCHAR(64),
  province         VARCHAR(64),
  postalcode       VARCHAR(64),
  country          VARCHAR(64)
);
CREATE TABLE IF NOT EXISTS members(
  id               SERIAL PRIMARY KEY,
  memberuid        VARCHAR(64),
  firstname        VARCHAR,
  lastname         VARCHAR,
  gender           VARCHAR(64),
  birthdate        TIMESTAMP,
  marital          VARCHAR(64),
  email            VARCHAR(64),
  phone            VARCHAR(64),
  familyid         INTEGER,
  familyrole       VARCHAR(64),
  memberrole       VARCHAR(64),
  membershipdate   TIMESTAMP,
  baptismdate      TIMESTAMP,
  access           BOOLEAN NOT NULL,
  avatar           VARCHAR,
  hearaboutus      TEXT,
  subscribtion     BOOLEAN NOT NULL,
  active           BOOLEAN NOT NULL,
  password         VARCHAR(255),
  sessionid        VARCHAR(255),
  FOREIGN KEY (familyid) REFERENCES families(id)
  
);

CREATE TABLE IF NOT EXISTS envelopes(
  id              SERIAL PRIMARY KEY,
  descriptiontext TEXT NOT NULL,
  envelopedate    VARCHAR NOT NULL,
  isopen          BOOLEAN NOT NULL,
  accountid       INTEGER,
  FOREIGN KEY (accountid) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS donations(
  id            SERIAL PRIMARY KEY,
  envelopeid    INTEGER,
  memberid      INTEGER,
  paytype       INTEGER,
  paydate       TIMESTAMP NOT NULL,
  checknumber   VARCHAR(64),
  FOREIGN KEY (envelopeid) REFERENCES envelopes(id),
  FOREIGN KEY (memberid) REFERENCES members(id),
  FOREIGN KEY (paytype) REFERENCES paymenttypes(id)
);

CREATE TABLE IF NOT EXISTS paymenttypes(
  id              SERIAL PRIMARY KEY,
  paymenttype        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS funds(
  id              SERIAL PRIMARY KEY,
  fundname        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS donationfund(
  donationid INTEGER,
  fundid     INTEGER,
  amount     FLOAT,
  FOREIGN KEY (donationid)  REFERENCES donations(id),
  FOREIGN KEY (fundid) REFERENCES funds(id)
);

CREATE TABLE IF NOT EXISTS grouptypes(
  id              SERIAL PRIMARY KEY,
  grouptype       VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS groups(
  id            SERIAL PRIMARY KEY,
  grouptypeid   INTEGER,
  groupname       VARCHAR,
  FOREIGN KEY (grouptypeid) REFERENCES grouptypes(id)
);

CREATE TABLE IF NOT EXISTS membergroup(
  memberid INTEGER,
  groupid  INTEGER,
  FOREIGN KEY (memberid)  REFERENCES members(id),
  FOREIGN KEY (groupid) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS accounts(
  id              SERIAL PRIMARY KEY,
  descriptiontext TEXT NOT NULL,
  accountdate    VARCHAR,
  isopen          BOOLEAN NOT NULL,
  candelete          BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions(
  id            SERIAL PRIMARY KEY,
  accountid    INTEGER,
  descriptiontext TEXT NOT NULL,
  transactiontype       VARCHAR(64),
  transactiondate       TIMESTAMP NOT NULL,
  amount     FLOAT,
  FOREIGN KEY (accountid) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS activities(
  id              SERIAL PRIMARY KEY,
  descriptiontext TEXT NOT NULL,
  activitydate    VARCHAR NOT NULL,
  memberid        INTEGER,
  FOREIGN KEY (memberid) REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS reports(
  id              SERIAL PRIMARY KEY,
  querystring     TEXT NOT NULL,
  reportdate    VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS emails(
  id              SERIAL PRIMARY KEY,
  subject         TEXT,
  specials        TEXT,
  emailtext       TEXT NOT NULL,
  emaildate    VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS memberemail(
  memberid        INTEGER,
  emailid         INTEGER,
  issent          BOOLEAN NOT NULL,
  FOREIGN KEY (emailid) REFERENCES emails(id),
  FOREIGN KEY (memberid) REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS groupemail(
  groupid        INTEGER,
  emailid         INTEGER,
  issent          BOOLEAN NOT NULL,
  FOREIGN KEY (emailid) REFERENCES emails(id),
  FOREIGN KEY (groupid) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS sms(
  id              SERIAL PRIMARY KEY,
  smstext       TEXT NOT NULL,
  smsdate    VARCHAR NOT NULL,
  specials        TEXT
);

CREATE TABLE IF NOT EXISTS membersms(
  memberid        INTEGER,
  smsid           INTEGER,
  issent          BOOLEAN NOT NULL,
  FOREIGN KEY (smsid) REFERENCES sms(id),
  FOREIGN KEY (memberid) REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS groupsms(
  groupid        INTEGER,
  smsid           INTEGER,
  issent          BOOLEAN NOT NULL,
  FOREIGN KEY (smsid) REFERENCES sms(id),
  FOREIGN KEY (groupid) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS settings (
  id              SERIAL PRIMARY KEY,
  churchname VARCHAR(255) NOT NULL,
  charitynumber VARCHAR(255) NOT NULL,
  streetaddress VARCHAR(50) NOT NULL,
  city VARCHAR(25) NOT NULL,
  province VARCHAR(2) NOT NULL,
  postalcode VARCHAR(10) NOT NULL,
  country VARCHAR(255) NOT NULL,
  currency VARCHAR(64) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  welcome TEXT NOT NULL,
  smtphost VARCHAR(50) NOT NULL,
  smtpport VARCHAR(50) NOT NULL,
  smtpuser VARCHAR(50) NOT NULL,
  smtppass VARCHAR(50) NOT NULL,
  smtpemail VARCHAR(50) NOT NULL,
  smtpname VARCHAR(255) NOT NULL,
  smtpsecure VARCHAR(64) NOT NULL,
  emailfooter TEXT,
  smsapikey VARCHAR(50) NOT NULL,
  smsapisecret VARCHAR(50) NOT NULL,
  smsnumber VARCHAR(15) NOT NULL,
  smsbalance VARCHAR(10) NOT NULL,
  memberidprefix VARCHAR(10) NOT NULL,
  memberidlength INTEGER NOT NULL,
  memberidautomate INTEGER NOT NULL,
  memberdefaultpassword VARCHAR(50) NOT NULL
);
INSERT INTO settings (
  churchname, charitynumber, streetaddress, city, province, postalcode, country, currency, phone, email, website, logo, welcome, smtphost, smtpport, smtpuser, smtppass, smtpemail, smtpname, smtpsecure, emailfooter, smsapikey, smsapisecret, smsnumber, smsbalance, memberidprefix, memberidlength, memberidautomate, memberdefaultpassword
  ) VALUES
('Sihone', '1111', '', '', '', '', '', '', '', '', '', '', '<p>We have dedicated time and resources to produce the ultimate software to help manage your organization.</p>\r\n\r\n<p>Sihone Software is built with simplicity to help facilitate management and leadership within any nonprofit institutions accepting donations, with an easy to use and intuitive interface. All features have been handcrafted to suit most day to day activities, with test cases carried on active running institutions.</p>\r\n\r\n<p>Our team work hard everyday to make sure any new needs are promptly met.</p>\r\n', 'smtp.zoho.com', '587', 'austin.takam@churchbrain.ca', 'Diane143', 'austin.takam@churchbrain.ca', 'Sihone Support', 'tls', 'God is good', '66d8e5af', '3aab08e28dbeaedd', '12262101213', '0', 'CB', 7, 1, 'abc123');

INSERT INTO members (
  firstname, lastname, email, memberrole, access, subscribtion, active, password
  ) VALUES
('System', 'Administrator', 'admin@sihone.com', 'administrator', true, true, true, 'b0de56832b707346517561ec51f50c6e945926c2e1f4ea0b58e0b0885c8d05f7');

INSERT INTO accounts (
  descriptiontext, accountdate, isopen, candelete
  ) VALUES
('General', null, true, false);

