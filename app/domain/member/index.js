const TRAITS = require('../../../data/traits');

const DEFAULT_PROPERTIES = {
    memberid: undefined,
    memberuid: '',
    firstname: '',
    lastname: '',
    get gender() {
        let value = undefined;
        TRAITS.forEach(TRAIT => {
            if (TRAIT.type === 'gender') {
                value = TRAIT.values[0].value;
            }
        });
        return value;
    },
    birthdate: undefined,
    get marital() {
        let value = undefined;
        TRAITS.forEach(TRAIT => {
            if (TRAIT.type === 'marital') {
                value = TRAIT.values[0].value;
            }
        });
        return value;
    },
    email: null,
    phone: '',
    familyid: undefined,
    get familyrole() {
        let value = undefined;
        TRAITS.forEach(TRAIT => {
            if (TRAIT.type === 'familyroles') {
                value = TRAIT.values[0].value;
            }
        });
        return value;
    },
    get memberrole() {
        let value = undefined;
        TRAITS.forEach(TRAIT => {
            if (TRAIT.type === 'roles') {
                value = TRAIT.values[0].value;
            }
        });
        return value;
    },
    get membershipdate() {
        return new Date()
    },
    baptismdate: undefined,
    access: true,
    avatar: undefined,
    hearaboutus: '',
    subscribtion: false,
    active: true,
    password: null,
    sessionid: undefined
}

class Member {
  constructor({
    memberid,
    memberuid,
    firstname,
    lastname,
    gender,
    birthdate,
    marital,
    email,
    phone,
    familyid,
    familyrole,
    memberrole,
    membershipdate,
    baptismdate,
    access,
    avatar,
    hearaboutus,
    subscribtion,
    active,
    password,
    sessionid
  } = {}) {
    email = email && email === '' ? null : email;
    this.memberid = memberid || DEFAULT_PROPERTIES.memberid;
    this.memberuid = memberuid || DEFAULT_PROPERTIES.memberuid;
    this.firstname = firstname || DEFAULT_PROPERTIES.firstname;
    this.lastname = lastname || DEFAULT_PROPERTIES.lastname;
    this.gender = gender || DEFAULT_PROPERTIES.gender;
    this.birthdate = birthdate || DEFAULT_PROPERTIES.birthdate;
    this.marital = marital || DEFAULT_PROPERTIES.marital;
    this.email = email || DEFAULT_PROPERTIES.email;
    this.phone = phone || DEFAULT_PROPERTIES.phone;
    this.familyid = familyid || DEFAULT_PROPERTIES.familyid;
    this.familyrole = familyrole || DEFAULT_PROPERTIES.familyrole;
    this.memberrole = memberrole || DEFAULT_PROPERTIES.memberrole;
    this.membershipdate = membershipdate || DEFAULT_PROPERTIES.membershipdate;
    this.baptismdate = baptismdate || DEFAULT_PROPERTIES.baptismdate;
    this.access = access || DEFAULT_PROPERTIES.access;
    this.avatar = avatar || DEFAULT_PROPERTIES.avatar;
    this.hearaboutus = hearaboutus || DEFAULT_PROPERTIES.hearaboutus;
    this.subscribtion = subscribtion || DEFAULT_PROPERTIES.subscribtion;
    this.active = active != undefined ? active : DEFAULT_PROPERTIES.active;
    this.password = password || DEFAULT_PROPERTIES.password;
    this.sessionid = sessionid || DEFAULT_PROPERTIES.sessionid;
  }
}

module.exports = Member;