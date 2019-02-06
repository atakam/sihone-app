const { Router } = require('express');
const Member = require('../domain/member');
const MemberTable = require('../domain/member/table');
const Family = require('../domain/family');
const FamilyTable = require('../domain/family/table');
const SettingsTable = require('../domain/settings/table');
const { setSession, authenticatedMember } = require('./helper');

const { hash } = require('../domain/member/helper');

const Session = require('../domain/member/session');

const router = new Router();

router.post('/new', (req, res, next) => {
    const { 
        memberuid,
        firstname,
        lastname,
        gender,
        birthdate,
        marital,
        email,
        phone,
        familyid,
        familyrole,
        memberrole,
        membershipdate,
        baptismdate,
        access,
        avatar,
        hearaboutus,
        subscribtion,
        active,
        password,
        familyname,
        familyemail,
        homephone,
        streetaddress,
        city,
        province,
        postalcode,
        country
     } = req.body;

    const member = new Member({
        memberuid,
        firstname,
        lastname,
        gender,
        birthdate,
        marital,
        email,
        phone,
        familyid,
        familyrole,
        memberrole,
        membershipdate,
        baptismdate,
        access,
        avatar,
        hearaboutus,
        subscribtion,
        active,
        password: hash(password)
    });

    let family = new Family({
        familyid,
        familyname,
        email: familyemail,
        phone: homephone,
        streetaddress,
        city,
        province,
        postalcode,
        country
    });

    console.log('body', req.body);

    if (familyid) {
        MemberTable.addMember(member)
        .then(() => res.json({
            message: 'successfully added member',
            member
         }))
        .catch(error => next(error));
    }
    else {
        FamilyTable.addFamily(family)
        .then(({ familyid }) => {
            family.familyid = familyid;
    
            console.log('resolved familyid', familyid);
    
            member.familyid = familyid;
            MemberTable.addMember(member)
            .then(() => res.json({
                message: 'successfully added member',
                member
             }))
            .catch(error => next(error));
        });
    }
});
  
router.post('/update', (req, res, next) => {
    const { 
        memberid,
        memberuid,
        firstname,
        lastname,
        gender,
        birthdate,
        marital,
        email,
        phone,
        familyid,
        familyrole,
        memberrole,
        membershipdate,
        baptismdate,
        access,
        avatar,
        hearaboutus,
        subscribtion,
        active,
        password,

        familyname,
        familyemail,
        homephone,
        streetaddress,
        city,
        province,
        postalcode,
        country
     } = req.body;

     let family = new Family({
        familyid,
        familyname,
        email: familyemail,
        phone: homephone,
        streetaddress,
        city,
        province,
        postalcode,
        country
    });

     console.log('update password', password);

    const member = new Member({
        memberid,
        memberuid,
        firstname,
        lastname,
        gender,
        birthdate,
        marital,
        email,
        phone,
        familyid,
        familyrole,
        memberrole,
        membershipdate,
        baptismdate,
        access,
        avatar,
        hearaboutus,
        subscribtion,
        active,
        password: password ? hash(password) : null
    });

    if (familyid) {
        MemberTable.updateMember(member)
        .then(() => res.json({ message: 'successfully updated member' }))
        .catch(error => next(error));
    }
    else {
        FamilyTable.addFamily(family)
        .then(({ familyid }) => {
            family.familyid = familyid;
    
            console.log('resolved familyid', familyid);
    
            member.familyid = familyid;
            MemberTable.updateMember(member)
            .then(() => res.json({ message: 'successfully updated member' }))
            .catch(error => next(error));
        });
    }
});

router.post('/delete', (req, res, next) => {
    const { 
        memberid
     } = req.body;

    MemberTable.deleteGroupsByMember({ memberid })
    .then(() => {
        return MemberTable.deleteMember({ memberid });
    })
    .then(() => res.json({ message: 'successfully deleted member' }))
    .catch(error => next(error));
});

router.get('/find/:id', (req, res, next) => {
    const { 
        id
     } = req.params;

     console.log('body', req.params);

    MemberTable.getMember({ id })
    .then((member) => res.json({
        message: 'successfully found member',
        member
    }))
    .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    MemberTable.getMembers()
        .then((members) => res.json({
            message: 'successfully found all members',
            members
        }))
        .catch(error => next(error));
});

router.get('/findAll/:familyId', (req, res, next) => {
    const { 
        familyId
     } = req.params;
    MemberTable.getMembersByFamilyId(familyId)
        .then((members) => res.json({
            message: 'successfully found all members',
            members
        }))
        .catch(error => next(error));
});

router.get('/findAll/g/:groupId', (req, res, next) => {
    const { 
        groupId
     } = req.params;
    MemberTable.getMembersByGroupId(groupId)
        .then((members) => res.json({
            message: 'successfully found all members',
            members
        }))
        .catch(error => next(error));
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
  
    MemberTable.getMemberByEmail({ email })
      .then((members) => {
        console.log("COUNT: ", members.length);
        if (members.length > 0 && members[0].password === hash(password)) {
          const { sessionid } = members[0];
        
          return setSession({ email, res, sessionid, role: members[0].memberrole, memberid: members[0].id });
        } else {
            return ({message: 'Incorrect email/password!', type: 'error'});
        }
      })
      .then(({ message, role, memberid, type }) => {
          if (type === 'error') res.json({ message, type });
          else res.json({ message, role, memberid });
      })
      .catch(error => {
          next(error);
      });
  });
  
  router.get('/logout', (req, res, next) => {
    const { email } = Session.parse(req.cookies.sessionString);
  
    MemberTable.updateSessionId({
      sessionId: null,
      email
    }).then(() => {
      res.clearCookie('sessionString');
  
      res.json({ message: 'Successful logout' });
    }).catch(error => next(error));
  });
  
  router.get('/authenticated', (req, res, next) => {
    authenticatedMember({ sessionString: req.cookies.sessionString })
      .then(({ authenticated, member }) => {
        authenticated ? res.json({ authenticated, role: member.memberrole, memberid: member.id }) :
        res.json({authenticated: false});
      })
      .catch(error => next(error));
  });

  router.get('/forgot/:email', (req, res, next) => {
    const { 
        email
     } = req.params;
     const password = makepassword(6);
    MemberTable.getMemberByEmail({ email })
        .then((members) => {
            if (members.length > 0) {
                return MemberTable.updatePassword({email, password: hash(password)});
            }
            else {
                return ({type: 'error', error: 'No account found with this email'});
            }
        })
        .then(({type, error}) => {
            if (type === 'error') res.json({ error, type });
            else {
                sendForgotPasswordEmail(email, password);
                //console.log("NEW PASSWORD", password);
                res.json({
                    message: 'Check your email!'
                })
            }
        })
        .catch(error => {
            res.json({
                error: 'Error occured. Please check the email entered and try again!'
            })
        });
});

function sendForgotPasswordEmail(email, password) {
    const body = `You have rquested to reset your password.<br>New password: ${password}`;
    sendEmail(email, "Forgotten Password", body);
}

function makepassword(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  function sendEmail(to, subject, body) {
    const nodemailer = require('nodemailer');
    SettingsTable.getSettings()
    .then((settings) => {
        const {
            smtpname,
            smtpemail,
            smtphost,
            smtpuser,
            smtppass,
            smtpport,
            smtpsecure,
            emailfooter
          } = settings;

          const emailSettings = {
            smtpname,
            smtpemail,
            smtphost,
            smtpuser,
            smtppass,
            smtpport,
            smtpsecure,
            emailfooter
          }

          console.log("Settings: ", emailSettings);
        
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: smtphost,
                port: smtpport,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: smtpuser, // generated ethereal user
                    pass: smtppass // generated ethereal password
                }
            });
    
            // setup email data with unicode symbols
            let mailOptions = {
                from: smtpname + ' <' + smtpemail + '>', // sender address
                bcc: to, // list of receivers
                subject: subject, // Subject line
                text: body.replace(/<[^>]*>/g, ''), // plain text body
                html: body // html body
            };
    
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });
    })
}

module.exports = router;