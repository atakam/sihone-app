const { Router } = require('express');
const Donation = require('../domain/donation');
const DonationTable = require('../domain/donation/table');
const DonationFundTable = require('../domain/donationfund/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    let {
        envelopeid,
        memberid,
        paytype,
        paydate,
        checknumber,
        donationfunds
     } = req.body;
     donationfunds = JSON.parse(donationfunds);

    const donation = new Donation({
        envelopeid,
        memberid,
        paytype,
        paydate,
        checknumber,
        donationfunds
    });

    console.log("Donation", donation);

    DonationTable.addDonation(donation)
    .then(({ donationid }) => {
        if (!donationfunds) donationfunds = [];
        return Promise.all(
            donationfunds.map(
                ({ fundid, amount }) => {
                    return DonationFundTable.addDonationFund({ donationid, fundid, amount })
                }
            )
        )
    })
    .then(() => {
        res.json({
            message: 'successfully added donation'
        });
    })
    .catch(error => next(error));
    
});
  
router.post('/update', (req, res, next) => {
    let { 
        donationid,
        envelopeid,
        memberid,
        paytype,
        paydate,
        checknumber,
        donationfunds
     } = req.body;
     donationfunds = JSON.parse(donationfunds);

    const donation = new Donation({
        donationid,
        envelopeid,
        memberid,
        paytype,
        paydate,
        checknumber,
        donationfunds
    });

    DonationTable.updateDonation(donation)
    .then(() => {
        if (donationfunds) {
            return Promise.all(
                donationfunds.map(
                    ({ fundid, amount }) => DonationFundTable.updateDonationFund({ donationid, fundid, amount })
                )
            )
        }
        return [];
    })
    .then(() => res.json({
        message: 'successfully updated donation'
    }))
    .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        donationid
     } = req.body;

    DonationFundTable.deleteDonationFundByDonationId({ donationid })
    .then(() => {
        return DonationTable.deleteDonation({ donationid })
    })
    .then(() => res.json({
        message: 'successfully deleted donation'
    }))
    .catch(error => next(error));
});

router.get('/find', (req, res, next) => {
    const { 
        donationid
    } = req.params;

    DonationTable.getDonation({ donationid })
    .then((donation) => {
        DonationFundTable.getFundsByDonationId({ donationid })
        .then((funds) => {
            donation.donationfunds = funds;
            res.json({
                message: 'successfully found donation',
                donation
            });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    DonationTable.getDonations()
    .then((donations) => {
        Promise.all(
            donations.map(
                (donation) => {
                    DonationFundTable.getFundsByDonationId({ donationid: donation.donationid })
                    .then((funds) => {
                        donation.donationfunds = funds;
                    })
                }
            )
        )
        .then(() => {
            res.json({
                message: 'successfully found all donations',
                donations
            })
        })
    })
    .catch(error => next(error));
});

router.get('/findAll/:envelopeid', (req, res, next) => {

    const { 
        envelopeid
    } = req.params;

    DonationTable.getDonationsByEnvelopeId({envelopeid})
    .then((donations) => {
        res.json({
            message: 'successfully found all donations',
            donations
        })
    })
    .catch(error => next(error));
});

router.get('/find/quick/:memberid/:quickFilter', (req, res, next) => {

    const {
        memberid,
        quickFilter
    } = req.params;

    DonationTable.getDonationsByQuickFilter({memberid, quickFilter})
    .then((donations) => {
        res.json({
            message: 'successfully found all donations',
            donations,
            quickFilterRange: getRange(quickFilter)
        })
    })
    .catch(error => next(error));
});

router.get('/find/custom/:memberid/:to/:from', (req, res, next) => {

    const {
        memberid,
        to,
        from
    } = req.params;

    DonationTable.getDonationsByCustomFilter({memberid, to, from})
    .then((donations) => {
        res.json({
            message: 'successfully found all donations',
            donations
        })
    })
    .catch(error => next(error));
});

function getRange(quickFilter) {
    var today = new Date();
    if (quickFilter === 'last30') {
        return dateFormat(new Date(today.setDate(today.getDate() - 30))) + ' - ' + dateFormat(new Date());
    }else if (quickFilter === 'last60') {
        return dateFormat(new Date(today.setDate(today.getDate() - 60))) + ' - ' + dateFormat(new Date());
    }else if (quickFilter === 'last90') {
        return dateFormat(new Date(today.setDate(today.getDate() - 90))) + ' - ' + dateFormat(new Date());
    }else if (quickFilter === 'thisYear') {
        return 'Jan 1 ' + today.getFullYear() + ' - ' + dateFormat(new Date());
    }
    else if (quickFilter === 'lastYear') {
        return 'Jan 1 ' + (today.getFullYear() - 1) + ' - ' + 'Dec 31 ' + (today.getFullYear() - 1);
    }
}

function dateFormat(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return month + ' ' + day + ' ' + year;
}

module.exports = router;