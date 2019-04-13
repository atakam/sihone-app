const Session = require('../domain/member/session');
const MemberTable = require('../domain/member/table');

const setSession = ({ email, res, sessionid, role, memberid, firstname }) => {
  return new Promise((resolve, reject) => {
    let session, sessionString;

    if (sessionid) {
      sessionString = Session.sessionString({ email, id: sessionid });

      setSessionCookie({ sessionString, res });

      resolve({ message: 'session restored', role, memberid, firstname });
    } else {
      session = new Session({ email });
      sessionString = session.toString();

      MemberTable.updateSessionId({
        sessionid: session.id,
        email
      })
      .then(() => {
        setSessionCookie({ sessionString, res });

        resolve({ message: 'session created', role, memberid, firstname });
      })
      .catch(error => reject(error));
    }
  });
}

const setSessionCookie = ({ sessionString, res }) => {
  res.cookie('sessionString', sessionString, {
    expire: Date.now() + 3600000,
    httpOnly: true
    // secure: true // use with https
  });
};

const authenticatedMember = ({ sessionString }) => {
  return new Promise((resolve, reject) => {
    if (!sessionString || !Session.verify(sessionString)) {
      const error = new Error('Invalid session');
  
      error.statusCode = 400;
  
      resolve({ member: null, authenticated: false, email: null });
    } else {
      const { email, id } = Session.parse(sessionString);
  
      MemberTable.getMemberByEmail({ email })
        .then((members) => {
          if (members.length) {
            const authenticated = members[0].sessionid === id;
            resolve({ member: members[0], authenticated, email });
          }
          else resolve({ member: null, authenticated: false, email: null });
        })
        .catch(error => reject(error));
    }
  });
};

module.exports = { setSession, authenticatedMember };