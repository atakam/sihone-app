const { Router } = require('express');
const request = require('request');
const Sms = require('../domain/sms');
const SmsTable = require('../domain/sms/table');
const MemberSmsTable = require('../domain/membersms/table');
const GroupSmsTable = require('../domain/groupsms/table');
const MemberTable = require('../domain/member/table');
const GroupTable = require('../domain/group/table');
const SettingsTable = require('../domain/settings/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    let {
        smstext,
        memberid, // An array of memberid's
        groupid,
        special
     } = req.body;

    const sms = new Sms({
        smstext,
        special
    });

    console.log('SMS', req.body);

    SmsTable.addSms(sms)
    .then(({ smsid }) => {
        if (memberid && memberid !== '0') {
            MemberTable.getPhone(memberid)
            .then((member) => {
                console.log(member);
                if (member.active && (member.subscribtion || member.subscription)) {
                    console.log('Should Send', member.phone);
                    sendSms(member.phone, smstext, res, ()=> {GroupSmsTable.addGroupSms({groupid, smsid})}, ()=>{MemberSmsTable.addMemberSms({memberid, smsid})});
                }
                else {
                    res.json({
                        message: 'Could not send to this user',
                        result: false
                    });
                }
            })
        }
        else if (groupid && groupid !== '0') {
            GroupTable.getPhones(groupid)
            .then((members) => {
                sendManySms(members, smstext, res);
            })
        }
        else if (special && special !== '') {
            MemberTable.getPhonesFromSpecial(special)
            .then((members) => {
                console.log(members);
                sendManySms(members, smstext, res);
            })
        }
    })
    .catch(error => next(error));
});

router.put('/delete', (req, res, next) => {
    const { 
        smsid
     } = req.body;

     MemberSmsTable.deleteMemberSmsBySmsId({ smsid })
    .then(() => {
        SmsTable.deleteSms({ smsid })
        .then(() => res.json({ message: 'successfully deleted sms' }))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/find', (req, res, next) => {
    const { 
        smsid
    } = req.body;

    SmsTable.getSms({ smsid })
    .then((sms) => {
        MemberSmsTable.getMembersBySmsId({ smsid })
        .then((members) => {
            sms.members = members;
            res.json({
                message: 'successfully found sms',
                sms
            });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/findAll/m/:memberid', (req, res, next) => {
    let {
        memberid
     } = req.params;

    MemberTable.getMember({ id: memberid })
    .then((member) => {
        MemberSmsTable.getSmsByMemberId({ memberid })
        .then(sms => {
            res.json({
                message: 'successfully found all sms',
                member,
                sms
            })
        })
    })
    .catch(error => next(error));
});

router.get('/findAll/g/:groupid', (req, res, next) => {
    let {
        groupid
     } = req.params;

    GroupTable.getGroup({ groupid })
    .then((group) => {
        GroupSmsTable.getSmsByGroupId({ groupid })
        .then(sms => {
            res.json({
                message: 'successfully found all sms',
                group,
                sms
            })
        })
    })
    .catch(error => next(error));
});

router.get('/findAll/s/:special', (req, res, next) => {
    let {
        special
     } = req.params;

     SmsTable.getSmsBySpecial({ special })
     .then(sms => {
         res.json({
             message: 'successfully found all sms',
             sms
         })
     })
    .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    SmsTable.getAllSms()
    .then((sms) => res.json({
        message: 'successfully found all sms',
        sms
    }))
    .catch(error => next(error));
});

router.get('/status', (req, res, next) => {
    const { 
        smsid
    } = req.body;

    MemberSmsTable.getSmsStatusesBySmsId({ smsid })
    .then((status) => res.json({
        message: 'successfully found status of smsid' + smsid,
        status
    }))
    .catch(error => next(error));
});

function sendManySms(members, smstext, res) {
    members.map((member) => {
        if (member.active && member.subscription) {
            sendSms(member.phone, smstext, res);
        }
    });
}

function sendSms(phone, smstext, res, callback1, callback2) {
    let phoneNumber = phone;
    if (!phone.startsWith("1")) {
        phoneNumber = '1' + phone;
    }
    SettingsTable.getSettings()
    .then((settings) => {
        const {
            smsapikey,
            smsapisecret,
            smsnumber
        } = settings;

        console.log('SETTINGS', {
            smsapikey,
            smsapisecret,
            smsnumber
        });

        const Nexmo = require('nexmo');

        const nexmo = new Nexmo({
            apiKey: smsapikey,
            apiSecret: smsapisecret
        });

        console.log('from:', smsnumber);
        console.log('to:', phoneNumber);
        console.log('text:', smstext);

        nexmo.message.sendSms(smsnumber, phoneNumber, smstext, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
            callback1 && callback1();
            callback2 && callback2();
            res.json({
                message: 'successfully added sms',
                result: responseData
            });
        })

        // axios({
        //     method: 'post',
        //     url: 'https://rest.nexmo.com/sms/json',
        //     data: {api_key: smsapikey, api_secret: smsapisecret, from: smsnumber, to: phoneNumber, text: smstext}
        //   })
        //   .then(function(response) {
        //     this.setState({
        //       notificationOpen: true
        //     });
        //     Utils.exportCSVFile(response.data.header, response.data.report, 'accounts');
        //   }.bind(this));

    });
}

module.exports = router;