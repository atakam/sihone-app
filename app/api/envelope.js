const { Router } = require('express');
const Envelope = require('../domain/envelope');
const EnvelopeTable = require('../domain/envelope/table');
const DonationTable = require('../domain/donation/table');
const AccountTable = require('../domain/account/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        descriptiontext,
        envelopedate,
        isopen,
        accountid
     } = req.body;

    const envelope = new Envelope({
        descriptiontext,
        envelopedate,
        isopen,
        accountid
    });

    console.log(req.body);

    EnvelopeTable.addEnvelope(envelope)
    .then(({ envelopeid }) => {
        envelope.envelopeid = envelopeid;
        res.json({
            message: 'successfully added envelope',
            envelope,
            body: req.body
        });
    })
    .catch(error => next(error));
    
});
  
router.post('/update', (req, res, next) => {
    const { 
        envelopeid,
        descriptiontext,
        envelopedate,
        isopen,
        accountid
     } = req.body;

    const envelope = new Envelope({
        envelopeid,
        descriptiontext,
        envelopedate,
        isopen,
        accountid
    });

    EnvelopeTable.updateEnvelope(envelope)
        .then(() => res.json({ message: 'successfully updated envelope' }))
        .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        envelopeid
     } = req.body;

     EnvelopeTable.deleteEnvelope({ envelopeid })
        .then(() => res.json({ message: 'successfully deleted envelope' }))
        .catch(error => next(error));
});

router.get('/find/:envelopeid', (req, res, next) => {
    const { 
        envelopeid
     } = req.params;

     EnvelopeTable.getEnvelope({ envelopeid })
        .then((envelope) => res.json({
            message: 'successfully found envelope',
            envelope
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    EnvelopeTable.getEnvelopes()
        .then((envelopes) => {
            return Promise.all(
                envelopes.map(envelope => {
                    return DonationTable.getDonationsByEnvelopeId({envelopeid: envelope.id})
                    .then((donations) => {
                        envelope.donations = donations;
                        return envelope
                    })
                })
            );
        })
        .then((envelopes) => {
            return Promise.all(
                envelopes.map(envelope => {
                    return AccountTable.getAccount({accountid: envelope.accountid})
                    .then((account) => {
                        envelope.accountdescription = account.descriptiontext;
                        return envelope
                    })
                })
            );
        })
        .then((envelopes) => 
            res.json({
            message: 'successfully found all envelopes',
            envelopes
        }))
        .catch(error => next(error));
});

router.get('/find/a/:accountid', (req, res, next) => {
    const { 
        accountid
     } = req.params;

     EnvelopeTable.getEnvelopesByAccountId({ accountid })
        .then((envelope) => res.json({
            message: 'successfully found envelope',
            envelope
        }))
        .catch(error => next(error));
});

module.exports = router;