const { Router } = require('express');
const Report = require('../domain/report');
const ReportTable = require('../domain/report/table');

const router = new Router();

router.post('/member', (req, res, next) => {

    ReportTable.runMember(req.body)
        .then(({report, header}) => res.json({
            success: true,
            message: 'successfully generated report',
            report,
            header
        }))
        .catch(error => next(error));
});

router.post('/donation', (req, res, next) => {

    ReportTable.runDonation(req.body)
        .then(({report, header}) => res.json({
            success: true,
            message: 'successfully generated report',
            report,
            header
        }))
        .catch(error => next(error));
});

router.post('/account', (req, res, next) => {

    ReportTable.runAccount(req.body)
        .then(({report, header}) => res.json({
            success: true,
            message: 'successfully generated report',
            report,
            header
        }))
        .catch(error => next(error));
});

module.exports = router;