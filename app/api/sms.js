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
        MemberSmsTable.addMemberSms({memberid, smsid})
        .then(() => {
            return GroupSmsTable.addGroupSms({groupid, smsid})
        })
        .then(() => {
            if (memberid && memberid !== '0') {
                MemberTable.getPhone(memberid)
                .then((phone) => {
                    sendSms(phone, smstext, res);
                })
            }
            else if (groupid && groupid !== '0') {
                GroupTable.getPhones(groupid)
                .then((phones) => {
                    sendManySms(phones, smstext, res);
                })
            }
            else if (special && special !== '') {
                MemberTable.getPhonesFromSpecial(special)
                .then((phones) => {
                    console.log(phones);
                    sendManySms(phones, smstext, res);
                })
            }
        })
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

function sendManySms(phoneArray, smstext, res) {
    phoneArray.filter(Boolean).map((phone) => {
        sendSms(phone, smstext, res);
    });
}

function sendSms(phone, smstext, res) {
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

        var options = {
            method: 'POST',
            url: 'https://rest.nexmo.com/sms/json',
            headers: 
            { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {api_key: smsapikey, api_secret: smsapisecret, from: smsnumber, to: phoneNumber, text: smstext}
        };
      
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            res.json({
                message: 'successfully added sms',
                result: body
            });
        }.bind(this));

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