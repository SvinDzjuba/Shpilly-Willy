const User = require('../models/User');
const Country = require('../models/Country');
const UserLanguages = require('../models/UserLanguages');
const Language = require('../models/Language');

exports.profile = async function (me) {
    let user = await User.findOne({ where: { id: me.userId } });
    let country = await Country.findOne({ where: { code: user.country } })
    user.country = country.name;

    let nm_date = (user.birthDate).replace('-', '/').replace('-', '/');
    let date = new Date(nm_date);
    let month_diff = Date.now() - new Date(date);
    let age_dt = new Date(month_diff);
    let year = age_dt.getUTCFullYear();
    let age = Math.abs(year - 1970);
    user.age = age;

    return user;
}

exports.myLanguages = async function (me) {
    let languagesId = await UserLanguages.findAll({
        where: { userId: me.userId },
        attributes: ['languageId']
    });
    let languages = [];
    for (let i = 0; i < languagesId.length; i++) {
        let languageName = await Language.findOne({ where: { id: languagesId[i].languageId } });
        languages.push(languageName.name);
    }
    return languages;
}

exports.editProfile = async function (id, body, photo) {
    const languages = Array.isArray(body.language) ? body.language : new Array(body.language);
    delete body.languages;
    body.photo = photo;
    await User.update(body, { where: { id: id } });
    await UserLanguages.destroy({ where: { userId: id } });
    for (let i = 0; i < languages.length; i++) {
        let language = await Language.findOne({ where: { name: languages[i] } });
        UserLanguages.create({
            userId: id,
            languageId: language.id
        });
    }
}