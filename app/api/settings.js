const { Router } = require('express');
const request = require('request');
const Settings = require('../domain/settings');
const SettingsTable = require('../domain/settings/table');
const mv = require('mv');
var path = require('path');
var appDir = path.dirname(require.main.filename);

const router = new Router();
  
router.post('/update', (req, res, next) => {
    const { 
        churchname,
        charitynumber,
        streetaddress,
        city,
        province,
        postalcode,
        country,
        currency,
        phone,
        email,
        website,
        logo,
        welcome,
        smtphost,
        smtpport,
        smtpuser,
        smtppass,
        smtpemail,
        smtpname,
        smtpsecure,
        emailfooter,
        smsapikey,
        smsapisecret,
        smsnumber,
        smsbalance,
        memberidprefix,
        memberidlength,
        memberidautomate,
        memberdefaultpassword
     } = req.body;

    const settings = new Settings({
        churchname,
        charitynumber,
        streetaddress,
        city,
        province,
        postalcode,
        country,
        currency,
        phone,
        email,
        website,
        logo,
        welcome,
        smtphost,
        smtpport,
        smtpuser,
        smtppass,
        smtpemail,
        smtpname,
        smtpsecure,
        emailfooter,
        smsapikey,
        smsapisecret,
        smsnumber,
        smsbalance,
        memberidprefix,
        memberidlength,
        memberidautomate,
        memberdefaultpassword
    });

    console.log('settings', settings);

    SettingsTable.updateSettings(settings)
        .then(() => res.json({ message: 'successfully updated settings' }))
        .catch(error => next(error));
});

router.post('/logo/update', (req, res, next) => {
    console.log('BODY', appDir);
    console.log('FILES', req.files);
    if (req.files) {
        let uploadFile = req.files.logo;
        const fileName = req.files.logo.name;
        mv(
            uploadFile.path,
            `${appDir}/data/files/images/logo/${fileName}`,
            function (err) {
                if (err) {
                    return res.status(500).send(err)
                }
                res.json({'message': 'file uploaded'})
            },
        )
    }
});

router.post('/identity/update', (req, res, next) => {
    console.log('BODY', req.body);
    SettingsTable.updateIdentitySettings(req.body)
        .then(() => res.json({ message: 'successfully updated settings' }))
        .catch(error => next(error));
});

router.post('/email/update', (req, res, next) => {
    console.log('settings', req.body);

    SettingsTable.updateEmailSettings(req.body)
        .then(() => res.json({ message: 'successfully updated settings' }))
        .catch(error => next(error));
});

router.post('/sms/update', (req, res, next) => {
    console.log('settings', req.body);

    SettingsTable.updateSmsSettings(req.body)
        .then(() => res.json({ message: 'successfully updated settings' }))
        .catch(error => next(error));
});

router.post('/stream/update', (req, res, next) => {
    console.log('settings', req.body);

    SettingsTable.updateStreamSettings(req.body)
        .then(() => res.json({ message: 'successfully updated settings' }))
        .catch(error => next(error));
});

router.post('/sms/balance', (req, res, next) => {
    console.log('sms balance', req.body);

    SettingsTable.updateSmsBalance(req.body)
        .then(() => res.json({ message: 'successfully updated sms balance' }))
        .catch(error => next(error));
});

router.post('/member/update', (req, res, next) => {
    console.log('settings', req.body);

    SettingsTable.updateMemberSettings(req.body)
        .then(() => res.json({ message: 'successfully updated settings' }))
        .catch(error => next(error));
});

router.get('/find/:tablename', (req, res, next) => {
    const { 
        tablename
     } = req.params;

     SettingsTable.getSetting(tablename)
        .then((settings) => res.json({
            message: 'successfully found settings',
            settings
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    SettingsTable.getSettings()
        .then((settings) => res.json({
            message: 'successfully found all settings',
            settings
        }))
        .catch(error => next(error));
});

router.get('/smsBalance', (req, res, next) => {
    SettingsTable.getSettings()
        .then((settings) => {
            const {
                smsapikey,
                smsapisecret
            } = settings;

            var options = {
                method: 'GET',
                url: 'https://rest.nexmo.com/account/get-balance?api_key='+smsapikey+'&api_secret='+smsapisecret
            };
          
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
                res.json({
                    message: 'successfully fetch balance',
                    result: body
                });
            }.bind(this));
        })
        .catch(error => next(error));
});

router.get('/logo', (req, res, next) => {
    const filename = `${appDir}/data/files/images/logo/logo.png`;
    res.sendFile(filename, null, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', filename);
        }
    });
});

router.get('/counts', (req, res, next) => {
    SettingsTable.getCounts()
    .then(({member, group, family, children}) => res.json({
        message: 'successfully found all counts',
        counts: {member, group, family, children}
    }))
    .catch(error => next(error));
});

module.exports = router;