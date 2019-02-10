const { Router } = require('express');
const Family = require('../domain/family');
const FamilyTable = require('../domain/family/table');
const MemberTable = require('../domain/member/table');

const router = new Router();
  
router.post('/update', (req, res, next) => {
    const { 
        familyid,
        familyname,
        email,
        phone,
        streetaddress,
        city,
        province,
        postalcode,
        country
     } = req.body;

    const family = new Family({
        familyid,
        familyname,
        email,
        phone,
        streetaddress,
        city,
        province,
        postalcode,
        country
    });

    FamilyTable.updateFamily(family)
        .then(() => res.json({ message: 'successfully updated family' }))
        .catch(error => next(error));
});

router.put('/delete', (req, res, next) => {
    const { 
        familyid
     } = req.body;

     FamilyTable.deleteFamily({ familyid })
        .then(() => res.json({ message: 'successfully deleted family' }))
        .catch(error => next(error));
});

router.get('/find/:id', (req, res, next) => {
    const { 
        id
     } = req.params;

    FamilyTable.getFamily( id )
        .then((family) => {
            MemberTable.getMembersByFamilyId(family.id)
            .then((members) => {
                family.members = members;
                res.json({
                    message: 'successfully found family',
                    family
                })
            })
        })
        .catch(error => next(error));
});

router.get('/findAll', (req, res, next) => {
    FamilyTable.getFamilies()
        .then((families) => 
            res.json({
            message: 'successfully found all families',
            families
        }))
        .catch(error => next(error));
});

module.exports = router;