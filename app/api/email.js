const { Router } = require('express');
const Email = require('../domain/email');
const EmailTable = require('../domain/email/table');
const MemberEmailTable = require('../domain/memberemail/table');
const GroupEmailTable = require('../domain/groupemail/table');
const MemberTable = require('../domain/member/table');
const GroupTable = require('../domain/group/table');
const SettingsTable = require('../domain/settings/table');

const router = new Router();

const DEFAULT_NAME = "JadeSoft";
const DEFAULT_FOOTER = "Thanks for using the JadeSoft Management Software!";
const DEFAULT_EMAIL = "support@jadesoft.ca";
const DEFAULT_HOST = "smtp.zoho.com";
const DEFAULT_USER = "support@jadesoft.ca";
const DEFAULT_PASSWORD = "Zoorp=5213!";
const DEFAULT_PORT = "465";
const DEFAULT_SECURITY = "tls";

router.post('/new', (req, res, next) => {
    let {
        subject,
        emailtext,
        memberids, // An array of memberid's
        groupids,
        specials
    } = req.body;

    console.log('BODY', req.body);

    const email = new Email({
        subject,
        emailtext
    });
    memberids = memberids || [];
    groupids = groupids || [];
    specials = specials || [];

    MemberTable.getEmails(memberids)
    .then((m_emails) => {
        GroupTable.getEmails(groupids)
        .then((g_emails) => {
            MemberTable.getEmailsFromSpecials(specials)
            .then((s_emails) => {
                console.log('M_TO', m_emails.filter(Boolean));
                console.log('G_TO', [].concat.apply([], g_emails).filter(Boolean));
                console.log('S_TO', [].concat.apply([], s_emails).filter(Boolean));

                const merge1 = m_emails.concat([].concat.apply([], g_emails).filter(Boolean));
                const merge2 = merge1.concat([].concat.apply([], s_emails).filter(Boolean));
                console.log('MERGED', arrayUnique(merge2.filter(Boolean)));

                if (arrayUnique(merge2.filter(Boolean)).length > 0) {
                    sendEmail(arrayUnique(merge2.filter(Boolean)).toString(), subject, emailtext).then((response) => {
                        console.log('SEND EMAIL RESPONSE', response);
                        if (response.status) {
                            EmailTable.addEmail(email)
                            .then(({ emailid }) => {
                                return Promise.all(
                                    [
                                        MemberEmailTable.addMemberEmail({memberids, emailid}),
                                        GroupEmailTable.addGroupEmail({groupids, emailid}),
                                        EmailTable.addSpecialEmail({specials, emailid})
                                    ]
                                );
                            })
                            .then(() => {
                                res.json({
                                    message: 'Email successfully sent!',
                                    email,
                                    success: true
                                });
                            })
                            .catch(error => next(error));
                        } else {
                            res.json({
                                message: response.error,
                                success: false
                            });
                            return;
                        }
                    });
                } else {
                    res.json({
                        message: 'Selected members or group members do not have an email defined',
                        success: false
                    });
                    return;
                }
            })
        })
    })
    .catch(error => next(error));
});

router.post('/welcome', (req, res, next) => {
    const { 
        email,
        subject,
        message
    } = req.body;

    sendEmail(email, subject, message).then((response) => {
        console.log('WELCOME EMAIL RESPONSE', response);
        if (response.status) {
            res.json({
                message: 'Successfully sent welcome email'
            });
        }
    });
});

router.post('/delete', (req, res, next) => {
    const { 
        emailid
     } = req.body;
     
    MemberEmailTable.deleteMemberEmailByEmailId({ emailid })
    .then(() => GroupEmailTable.deleteGroupEmailByEmailId({ emailid }))
    .then(() => {
        EmailTable.deleteEmail({ emailid })
        .then(() => res.json({ message: 'successfully deleted email' }))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/find', (req, res, next) => {
    const { 
        emailid
    } = req.body;

    EmailTable.getEmail({ emailid })
    .then((email) => {
        MemberEmailTable.getMembersByEmailId({ emailid })
        .then((members) => {
            email.members = members;
            res.json({
                message: 'successfully found email',
                email
            });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    EmailTable.getAllEmail()
    .then((emails) => res.json({
        message: 'successfully found all emails',
        emails
    }))
    .catch(error => next(error));
});

router.get('/findMembers', (req, res, next) => {
    const { 
        emailid
    } = req.body;

    MemberEmailTable.getMembersByEmailId({ emailid })
    .then((members) => res.json({
        message: 'successfully found members of emailid' + emailid,
        members
    }))
    .catch(error => next(error));
});

router.get('/status', (req, res, next) => {
    const { 
        emailid
    } = req.body;

    MemberEmailTable.getEmailStatusesByEmailId({ emailid })
    .then((status) => res.json({
        message: 'successfully found status of emailid' + emailid,
        status
    }))
    .catch(error => next(error));
});


router.get('/group_find', (req, res, next) => {
    const { 
        emailid
    } = req.body;

    EmailTable.getEmail({ emailid })
    .then((email) => {
        GroupEmailTable.getGroupsByEmailId({ emailid })
        .then((groups) => {
            email.groups = groups;
            res.json({
                message: 'successfully found email',
                email
            });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/group_findAll', (req, res, next) => {
    EmailTable.getAllEmail()
    .then((allemail) => {
        Promise.all(
            allemail.map(
              ({ email }) => {
                GroupEmailTable.getGroupsByEmailId({ emailid: email.emailid })
                .then((groups) => {
                    email.groups = groups;
                    return email
                })
                .catch(error => next(error));
              }
            )
        )
        .then(allemail => {
            res.json({
                message: 'successfully found all email',
                allemail
            })
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/findGroups', (req, res, next) => {
    const { 
        emailid
    } = req.body;

    GroupEmailTable.getGroupsByEmailId({ emailid })
    .then((groups) => res.json({
        message: 'successfully found groups of emailid' + emailid,
        groups
    }))
    .catch(error => next(error));
});

router.get('/group_status', (req, res, next) => {
    const { 
        emailid
    } = req.body;

    GroupEmailTable.getGroupStatusesByEmailId({ emailid })
    .then((status) => res.json({
        message: 'successfully found status of emailid' + emailid,
        status
    }))
    .catch(error => next(error));
});

function sendEmail(to, subject, body) {
    const nodemailer = require('nodemailer');
    SettingsTable.getSettings()
    .then((settings) => {
        let {
            smtpname,
            smtpemail,
            smtphost,
            smtpuser,
            smtppass,
            smtpport,
            smtpsecure,
            emailfooter
          } = settings;

          smtpname = smtpname || DEFAULT_NAME;
          smtpemail = smtpemail || DEFAULT_EMAIL;
          smtphost = smtphost || DEFAULT_HOST;
          smtpuser = smtpuser || DEFAULT_USER;
          smtppass = smtppass || DEFAULT_PASSWORD;
          smtpport = smtpport || DEFAULT_PORT;
          smtpsecure = smtpsecure || DEFAULT_SECURITY;
          emailfooter = emailfooter || DEFAULT_FOOTER;

          const emailSettings = {
            smtpname,
            smtpemail,
            smtphost,
            smtpuser,
            smtppass,
            smtpport,
            smtpsecure,
            emailfooter
          };

          console.log("Settings: ", emailSettings);
        
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: smtphost,
                port: smtpport,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: smtpuser, // generated ethereal user
                    pass: smtppass // generated ethereal password
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
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
            console.log('MAIL OPTIONS: ', mailOptions);
    
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);

                }
                console.log('Message sent: %s', info);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });
    });
    return Promise.resolve({status: true});
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

module.exports = router;