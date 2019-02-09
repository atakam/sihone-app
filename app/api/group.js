const { Router } = require('express');
const Group = require('../domain/group');
const MemberGroup = require('../domain/membergroup');
const GroupTable = require('../domain/group/table');
const MemberTable = require('../domain/member/table');
const MemberGroupTable = require('../domain/membergroup/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        groupname,
        grouptypeid
     } = req.body;

    const group = new Group({
        groupname,
        grouptypeid
    });

    GroupTable.addGroup(group)
        .then(() => res.json({
            message: 'successfully added group',
            group
         }))
        .catch(error => next(error));
    
});
  
router.post('/update', (req, res, next) => {
    const { 
        groupid,
        groupname,
        grouptypeid
     } = req.body;

    const group = new Group({
        groupid,
        groupname,
        grouptypeid
    });

    GroupTable.updateGroup(group)
        .then(() => res.json({ message: 'successfully updated group' }))
        .catch(error => next(error));
});

router.post('/addMember', (req, res, next) => {
    const { 
        groupid,
        memberid
     } = req.body;

    const membergroup = new MemberGroup({
        groupid,
        memberid
    });

    MemberGroupTable.addMemberGroup(membergroup)
        .then(() => res.json({ message: 'successfully updated member group' }))
        .catch(error => next(error));
});

router.post('/removeMember', (req, res, next) => {
    const { 
        groupid,
        memberid
     } = req.body;

    const membergroup = new MemberGroup({
        groupid,
        memberid
    });

    MemberGroupTable.deleteMemberGroupByMemberId(membergroup)
        .then(() => res.json({ message: 'successfully updated member group' }))
        .catch(error => next(error));
});

router.post('/removeGroup', (req, res, next) => {
    const { 
        groupid,
        memberid
     } = req.body;

    const membergroup = new MemberGroup({
        groupid,
        memberid
    });

    MemberGroupTable.deleteMemberGroupByGroupId(membergroup)
        .then(() => res.json({ message: 'successfully updated member group' }))
        .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        groupid
     } = req.body;

     GroupTable.deleteGroup({ groupid })
        .then(() => res.json({ message: 'successfully deleted group' }))
        .catch(error => next(error));
});

router.get('/find/:id', (req, res, next) => {
    const { 
        id
     } = req.params;

     GroupTable.getGroup( { groupid: id } )
        .then((group) => {
            MemberTable.getMembersByGroupId(group.id)
            .then((members) => {
                group.members = members;
                res.json({
                    message: 'successfully found family',
                    group
                })
            })
        })
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    GroupTable.getGroups()
        .then((groups) => {
            return Promise.all(
                groups.map(group => {
                    return MemberTable.getMembersByGroupId(group.id)
                    .then((members) => {
                        group.count = members.length;
                        return group
                    })
                })
            );
        })
        .then((groups) => 
            res.json({
            message: 'successfully found all groups',
            groups
        }))
        .catch(error => next(error));
});

router.get('/findAllWithEmails', (req, res, next) => {
    GroupTable.getGroupsWithEmails()
        .then((groups) => 
            res.json({
            message: 'successfully found all groups',
            groups
        }))
        .catch(error => next(error));
});

router.get('/findAll/m/:memberId', (req, res, next) => {
    const { 
        memberId
     } = req.params;
     GroupTable.getGroupsByMemberId(memberId)
        .then((groups) => res.json({
            message: 'successfully found all groups',
            groups
        }))
        .catch(error => next(error));
});

module.exports = router;