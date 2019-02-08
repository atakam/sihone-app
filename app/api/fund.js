const { Router } = require('express');
const Fund = require('../domain/fund');
const FundTable = require('../domain/fund/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        fundname
     } = req.body;

    const fund = new Fund({
        fundname
    });

    FundTable.addFund(fund)
        .then(() => res.json({
            message: 'successfully added fund',
            fund
         }))
        .catch(error => next(error));
    
});

router.post('/delete', (req, res, next) => {
    const { 
        fundid
     } = req.body;

     FundTable.deleteFund({ fundid })
        .then(() => res.json({ message: 'successfully deleted fund' }))
        .catch(error => res.json({ error: true, message: 'Cannot delete entry as it is being used' }));
});

router.get('/find', (req, res, next) => {
    const { 
        fundid
     } = req.body;

     FundTable.getFund({ fundid })
        .then((fund) => res.json({
            message: 'successfully found fund',
            fund
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    FundTable.getFunds()
        .then((funds) => res.json({
            message: 'successfully found all funds',
            funds
        }))
        .catch(error => next(error));
});

module.exports = router;