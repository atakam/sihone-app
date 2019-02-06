const { Router } = require('express');
const Activity = require('../domain/activity');
const ActivityTable = require('../domain/activity/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        descriptiontext,
        activitydate,
        memberid
     } = req.body;

    const activity = new Activity({
        descriptiontext,
        activitydate,
        memberid
    });

    ActivityTable.addActivity(activity)
    .then(({ activityid }) => {
        activity.activityid = activityid;
        res.json({
            message: 'successfully added activity',
            activity,
            body: req.body
        });
    })
    .catch(error => next(error));
    
});

router.post('/delete', (req, res, next) => {
    const { 
        activityid
     } = req.body;

     ActivityTable.deleteActivity({ activityid })
        .then(() => res.json({ message: 'successfully deleted activity' }))
        .catch(error => next(error));
});

router.get('/find', (req, res, next) => {
    const { 
        activityid
     } = req.body;

     ActivityTable.getActivity({ activityid })
        .then((activity) => res.json({
            message: 'successfully found activity',
            activity
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    ActivityTable.getActivitys()
        .then((activities) => res.json({
            message: 'successfully found all activities',
            activities
        }))
        .catch(error => next(error));
});

module.exports = router;