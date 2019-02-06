const { Router } = require('express');
const PaymentType = require('../domain/paymenttype');
const PaymentTypeTable = require('../domain/paymenttype/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        paymenttype
     } = req.body;

    const paymenttypeobj = new PaymentType({
        paymenttype
    });

    PaymentTypeTable.addPaymentType(paymenttypeobj)
        .then(() => res.json({
            message: 'successfully added paymenttype',
            paymenttypeobj
         }))
        .catch(error => next(error));
    
});
  
router.put('/update', (req, res, next) => {
    const { 
        paymenttypeid,
        paymenttype
     } = req.body;

    const paymenttypeobj = new PaymentType({
        paymenttypeid,
        paymenttype
    });

    PaymentTypeTable.updatePaymentType(paymenttypeobj)
        .then(() => res.json({ message: 'successfully updated paymenttype' }))
        .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        paymenttypeid
     } = req.body;

     PaymentTypeTable.deletePaymentType({ paymenttypeid })
        .then(() => res.json({ message: 'successfully deleted paymenttype' }))
        .catch(error => res.json({ error: true, message: 'Cannot delete entry as it is being used' }));
});

router.get('/find/:id', (req, res, next) => {
    const { 
        id
     } = req.params;

     console.log('body', req.params);

     PaymentTypeTable.getPaymentType({ id })
        .then((paymenttype) => res.json({
            message: 'successfully found paymenttype',
            paymenttype
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    PaymentTypeTable.getPaymentTypes()
        .then((paymenttypes) => res.json({
            message: 'successfully found all paymenttypes',
            paymenttypes
        }))
        .catch(error => next(error));
});

module.exports = router;