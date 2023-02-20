function calculateAge(f_usersList, age) {
    let usersList = [];
    let users = [];
    for (let i = 0; i < f_usersList.length; i++) {
        let user = f_usersList[i];
        let nm_date = (user.birthDate).replace('-', '/').replace('-', '/');
        let date = new Date(nm_date);
        let month_diff = Date.now() - new Date(date);
        let age_dt = new Date(month_diff); 
        let year = age_dt.getUTCFullYear();
        let age = Math.abs(year - 1970);
        user.age = age;
        users.push(user);
    }
    users.forEach(user => {
        if(user.age === Number(age)) {
            usersList.push(user);
        }
    });
    return usersList;
}
exports.users = async function() {
    const User = require('../models/User');
    const Country = require('../models/Country');
    let users = await User.findAll();
    for (let i = 0; i < users.length; i++) {
        let country = await Country.findOne({
            where: { code: users[i].country },
            attributes: ['name']
        });
        users[i].country = country.name;

        // Calculate user's age
        let nm_date = (users[i].birthDate).replace('-', '/').replace('-', '/');
        let date = new Date(nm_date);
        let month_diff = Date.now() - new Date(date);
        let age_dt = new Date(month_diff); 
        let year = age_dt.getUTCFullYear();
        let age = Math.abs(year - 1970);
        users[i].age = age;
    }
    return users;
}

exports.filter = async function(age, gender, country, city) {
    const { Op } = require('sequelize');
    const User = require('../models/User');
    const Country = require('../models/Country');
    var usersList = [];

    let filteredUsers = [];
    let allUsers = await User.findAll();
    // if(gender !== '') {
    //     for (let i = 0; i < allUsers.length; i++) {
    //         if(allUsers[i].gender === gender) {
    //             filteredUsers.push(allUsers[i]);
    //         }    
    //     }
    // }
    if(country !== '') {
        country = await Country.findOne({
            where: { name: country }
        });
        for (let i = 0; i < allUsers.length; i++) {
            if(allUsers[i].country === country) {
                filteredUsers.push(allUsers[i]);
            }
        }
    }
    else if(city !== '') {
        for (let i = 0; i < allUsers.length; i++) {
            if(allUsers[i].city === city) {
                filteredUsers.push(allUsers[i]);
            }
        }
    }
    else if(gender !== '') {
        console.log('bbbbbbbbbbbbbbbbbbbbbbbb');
        for (let i = 0; i < allUsers.length; i++) {
            if(allUsers[i].gender === gender) {
                filteredUsers.push(allUsers[i]);
            }
        }
    }
    else if(age !== '') {
        console.log(age);
        for (let i = 0; i < allUsers.length; i++) {
            let nm_date = (allUsers[i].birthDate).replace('-', '/').replace('-', '/');
            let date = new Date(nm_date);
            let month_diff = Date.now() - new Date(date);
            let age_dt = new Date(month_diff); 
            let year = age_dt.getUTCFullYear();
            let age = Math.abs(year - 1970);
            allUsers[i].age = age;
            
            if(allUsers[i].age == Number(age)) {
                console.log(allUsers[i]);
                filteredUsers.push(allUsers[i]);
            }
        }
    }

    // if(country != '') {
    //     country = await Country.findOne({
    //         where: { name: country },
    //         attributes: ['code']
    //     });
    // }
    // let findUsers = await User.findAll({
    //     where: {
    //         [Op.or]: [
    //             { gender: gender ? gender : null },
    //             { country: country ? country.code : null },
    //             { city: city ? city : null },
    //         ]
    //     }
    // });
    // usersList = findUsers;
    // if(age != '') {
    //     if(findUsers.length > 0) {
    //         usersList = calculateAge(findUsers, age);
    //     } else {
    //         let users = await User.findAll();
    //         usersList = calculateAge(users, age);
    //     }
    // }
    // for (let i = 0; i < usersList.length; i++) {
    //     let nm_date = (usersList[i].birthDate).replace('-', '/').replace('-', '/');
    //     let date = new Date(nm_date);
    //     let month_diff = Date.now() - new Date(date);
    //     let age_dt = new Date(month_diff); 
    //     let year = age_dt.getUTCFullYear();
    //     let age = Math.abs(year - 1970);
    //     usersList[i].age = age;
    // }
    // console.log(filteredUsers);
    return filteredUsers;
}