const { Router } = require('express');
const GroupType = require('../domain/grouptype');
const GroupTypeTable = require('../domain/grouptype/table');

const router = new Router();

router.post('/new', (req, res, next) => {
    const {
        grouptype
     } = req.body;

    const grouptypeobj = new GroupType({
        grouptype
    });

    GroupTypeTable.addGroupType(grouptypeobj)
        .then(() => res.json({
            message: 'successfully added grouptype',
            grouptypeobj
         }))
        .catch(error => next(error));
    
});
  
router.put('/update', (req, res, next) => {
    const { 
        grouptypeid,
        grouptype
     } = req.body;

    const grouptypeobj = new GroupType({
        grouptypeid,
        grouptype
    });

    GroupTypeTable.updateGroupType(grouptypeobj)
        .then(() => res.json({ message: 'successfully updated grouptype' }))
        .catch(error => next(error));
});

router.post('/delete', (req, res, next) => {
    const { 
        grouptypeid
     } = req.body;

     GroupTypeTable.deleteGroupType({ grouptypeid })
        .then(() => res.json({ message: 'successfully deleted grouptype' }))
        .catch(error => res.json({ error: true, message: 'Cannot delete entry as it is being used' }));
});

router.get('/find/:id', (req, res, next) => {
    const { 
        id
     } = req.params;

     console.log('body', req.params);

     GroupTypeTable.getGroupType({ id })
        .then((grouptype) => res.json({
            message: 'successfully found grouptype',
            grouptype
        }))
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    GroupTypeTable.getGroupTypes()
        .then((grouptypes) => res.json({
            message: 'successfully found all grouptypes',
            grouptypes
        }))
        .catch(error => next(error));
});

module.exports = router;