const express = require('express');
const cors = require('cors');
const path = require('path');

const donationRouter = require('./api/donation');
const envelopeRouter = require('./api/envelope');
const familyRouter = require('./api/family');
const fundRouter = require('./api/fund');
const groupRouter = require('./api/group');
const groupTypeRouter = require('./api/grouptype');
const paymentTypeRouter = require('./api/paymenttype');
const memberRouter = require('./api/member');

const transactionRouter = require('./api/transaction');
const accountRouter = require('./api/account');
const activityRouter = require('./api/activity');
const emailRouter = require('./api/email');
const smsRouter = require('./api/sms');
const reportRouter = require('./api/report');
const settingsRouter = require('./api/settings');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// const ORIGIN = 'https://sihone-app-client-demo.herokuapp.com';
// app.use(cors({origin: ORIGIN, credentials: true}));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use('/donation', donationRouter);
app.use('/envelope', envelopeRouter);
app.use('/family', familyRouter);
app.use('/fund', fundRouter);
app.use('/group', groupRouter);
app.use('/grouptype', groupTypeRouter);
app.use('/paymenttype', paymentTypeRouter);
app.use('/member', memberRouter);

app.use('/transaction', transactionRouter);
app.use('/account', accountRouter);
app.use('/activity', activityRouter);
app.use('/email', emailRouter);
app.use('/sms', smsRouter);
app.use('/report', reportRouter);

app.use('/settings', settingsRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app;