const { Router } = require('express');
const Account = require('../domain/account');
const AccountTable = require('../domain/account/table');
const TransactionTable = require('../domain/transaction/table');
const EnvelopeTable = require('../domain/envelope/table');
const DonationTable = require('../domain/donation/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        descriptiontext,
        accountdate,
        isopen
     } = req.body;

    const account = new Account({
        descriptiontext,
        accountdate,
        isopen
    });

    AccountTable.addAccount(account)
    .then(({ accountid }) => {
        account.accountid = accountid;
        res.json({
            message: 'successfully added account',
            account,
            body: req.body
        });
    })
    .catch(error => next(error));
    
});
  
router.post('/update', (req, res, next) => {
    const { 
        accountid,
        descriptiontext,
        accountdate,
        isopen
     } = req.body;

    const account = new Account({
        accountid,
        descriptiontext,
        accountdate,
        isopen
    });

    AccountTable.updateAccount(account)
    .then(({ accountid }) => res.json({ message: 'successfully updated account: ' + accountid }))
    .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        accountid
     } = req.body;

     AccountTable.deleteAccount({ accountid })
        .then(() => res.json({ message: 'successfully deleted account' }))
        .catch(error => next(error));
});

router.get('/find/:id', (req, res, next) => {
    const { 
        id
     } = req.params;

     AccountTable.getAccount({ accountid: id })
        .then((account) => res.json({
            message: 'successfully found account',
            account
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    AccountTable.getAccounts()
        .then((accounts) => {
            return Promise.all(
                accounts.map(account => {
                    return TransactionTable.getTransactionsByAccountId({accountid: account.id})
                    .then((transactions) => {
                        account.transactions = transactions;
                        return account
                    })
                })
            );
        })
        .then((accounts) => {
            return Promise.all(
                accounts.map(account => {
                    return EnvelopeTable.getEnvelopesByAccountId({accountid: account.id})
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
                        account.envelopes = envelopes;
                        return account
                    })
                })
            );
        })
        .then((accounts) => 
            res.json({
            message: 'successfully found all accounts',
            accounts
        }))
        .catch(error => next(error));
});

module.exports = router;