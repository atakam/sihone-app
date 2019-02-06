const { Router } = require('express');
const Transaction = require('../domain/transaction');
const TransactionTable = require('../domain/transaction/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    let {
        accountid,
        descriptiontext,
        memberid,
        transactiontype,
        transactiondate,
        amount
     } = req.body;

    const transaction = new Transaction({
        accountid,
        descriptiontext,
        memberid,
        transactiontype,
        transactiondate,
        amount
    });

    console.log('transaction', transaction);

    TransactionTable.addTransaction(transaction)
    .then(({ transactionid }) => {
        transaction.transactionid = transactionid;
        res.json({
            message: 'successfully added transaction',
            transaction
        });
    })
    .catch(error => next(error));
    
});
  
router.post('/update', (req, res, next) => {
    const { 
        transactionid,
        descriptiontext,
        accountid,
        memberid,
        transactiontype,
        transactiondate,
        amount
     } = req.body;

    const transaction = new Transaction({
        transactionid,
        descriptiontext,
        accountid,
        memberid,
        transactiontype,
        transactiondate,
        amount
    });

    TransactionTable.updateTransaction(transaction)
    .then(() => {
        res.json({
            message: 'successfully updated transaction',
            transaction
        });
    })
    .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        transactionid
     } = req.body;

    TransactionTable.deleteTransaction({ transactionid })
    .then(() => res.json({
        message: 'successfully deleted transaction'
    }))
    .catch(error => next(error));
});

router.get('/find', (req, res, next) => {
    const { 
        transactionid
    } = req.body;

    TransactionTable.getTransaction({ transactionid })
    .then((transaction) => {
        res.json({
            message: 'successfully found transaction',
            transaction
        });
    })
    .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    TransactionTable.getTransactions()
    .then((transactions) => {
        res.json({
            message: 'successfully found all transactions',
            transactions
        })
    })
    .catch(error => next(error));
});

router.get('/findAll/:accountid', (req, res, next) => {

    const { 
        accountid
    } = req.params;

    TransactionTable.getTransactionsByAccountId({accountid})
    .then((transactions) => {
        res.json({
            message: 'successfully found all transactions',
            transactions
        })
    })
    .catch(error => next(error));
});

module.exports = router;