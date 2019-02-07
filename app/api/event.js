const { Router } = require('express');
const Event = require('../domain/event');
const EventTable = require('../domain/event/table');
const MemberEventTable = require('../domain/memberevent/table');
const GroupEventTable = require('../domain/groupevent/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    let {
        description,
        location,
        startdate,
        enddate,
        allday,
        repeat,
        guests,
        groups
    } = req.body;

    console.log('BODY', req.body);

    const event = new Event({
        description,
        location,
        startdate,
        enddate,
        allday,
        repeat,
        guests,
        groups
    });
    guests = guests || [];
    groups = groups || [];

    EventTable.addEvent(event)
    .then(({ eventid }) => {
        return Promise.all(
            [
                MemberEventTable.addMemberEvent({guests, eventid}),
                GroupEventTable.addGroupEvent({groups, eventid})
            ]
        );
    })
    .then(() => {
        res.json({
            message: 'Event successfully added!',
            event,
            success: true
        });
    })
    .catch(error => next(error));
});

router.post('/update', (req, res, next) => {
    let {
        eventid,
        description,
        location,
        startdate,
        enddate,
        allday,
        repeat,
        guests,
        groups
    } = req.body;

    console.log('BODY', req.body);

    const event = new Event({
        eventid,
        description,
        location,
        startdate,
        enddate,
        allday,
        repeat,
        guests,
        groups
    });
    guests = guests || [];
    groups = groups || [];

    EventTable.updateEvent(event)
    .then(({ eventid }) => {
        return Promise.all(
            [
                MemberEventTable.deleteMemberEventByEventId({eventid}),
                GroupEventTable.deleteGroupEventByEventId({eventid}),
                MemberEventTable.addMemberEvent({guests, eventid}),
                GroupEventTable.addGroupEvent({groups, eventid})
            ]
        );
    })
    .then(() => {
        res.json({
            message: 'Event successfully added!',
            event,
            success: true
        });
    })
    .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        eventid
     } = req.body;
     
    MemberEventTable.deleteMemberEventByEventId({ eventid })
    .then(() => GroupEventTable.deleteGroupEventByEventId({ eventid }))
    .then(() => {
        EventTable.deleteEvent({ eventid })
        .then(() => res.json({ message: 'successfully deleted event' }))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/find', (req, res, next) => {
    const { 
        eventid
    } = req.body;

    EventTable.getEvent({ eventid })
    .then((event) => {
        MemberEventTable.getMembersByEventId({ eventid })
        .then((members) => {
            event.members = members;
            res.json({
                message: 'successfully found event',
                event
            });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    EventTable.getAllEvent()
    .then((events) => res.json({
        message: 'successfully found all events',
        events
    }))
    .catch(error => next(error));
});

router.get('/findMembers', (req, res, next) => {
    const { 
        eventid
    } = req.body;

    MemberEventTable.getMembersByEventId({ eventid })
    .then((members) => res.json({
        message: 'successfully found members of eventid' + eventid,
        members
    }))
    .catch(error => next(error));
});

router.get('/group_find', (req, res, next) => {
    const { 
        eventid
    } = req.body;

    EventTable.getEvent({ eventid })
    .then((event) => {
        GroupEventTable.getGroupsByEventId({ eventid })
        .then((groups) => {
            event.groups = groups;
            res.json({
                message: 'successfully found event',
                event
            });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/group_findAll', (req, res, next) => {
    EventTable.getAllEvent()
    .then((allevent) => {
        Promise.all(
            allevent.map(
              ({ event }) => {
                GroupEventTable.getGroupsByEventId({ eventid: event.eventid })
                .then((groups) => {
                    event.groups = groups;
                    return event
                })
                .catch(error => next(error));
              }
            )
        )
        .then(allevent => {
            res.json({
                message: 'successfully found all event',
                allevent
            })
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/findGroups', (req, res, next) => {
    const { 
        eventid
    } = req.body;

    GroupEventTable.getGroupsByEventId({ eventid })
    .then((groups) => res.json({
        message: 'successfully found groups of eventid' + eventid,
        groups
    }))
    .catch(error => next(error));
});

module.exports = router;