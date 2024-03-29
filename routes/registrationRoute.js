module.exports = (app, __dirname, URheader, loggedHeader) => {
    const { register } = require('../controllers/registrationController');
    const { countries, languages, cities, additionalData } = require('../controllers/dataRecieverController');
    const router = require('express').Router();
    const fs = require('fs');

    // Get all countries
    var countriesList;
    countries().then(data => { countriesList = data; });

    // Get all languages
    var languagesList;
    languages().then(data => { languagesList = data; });

    // Get all cities
    var citiesList;
    cities().then(data => { citiesList = data; });

    router.get('/', function (req, res) {
        var header = '';
        let cookie = req.session;
        loggedHeader(cookie).then(LGheader => {
            if (cookie.userId != undefined) { header = LGheader }
            else { header = URheader }
            res.render('registration', {
                header: header,
                languages: languagesList,
                countries: countriesList,
                cities: citiesList,
                educations: additionalData.educations,
                relationshipStatus: additionalData.relationshipStatus,
                children: additionalData.children,
                religions: additionalData.religions
            });
        });
    });

    router.post('/', function (req, res) {
        if (!req.body.username || !req.body.password
            || !req.body.fullName || !req.body.email
            || !req.body.birthDate || !req.body.country
            || !req.body.city || !req.body.language
            || !req.body.education || !req.body.relationshipStatus
            || !req.body.children || !req.body.religion
            || !req.body.gender) {
            res.status(404).send({
                message: 'Fill in all required fields!'
            });
            return;
        }

        const { image } = req.files;
        if (!image) return res.sendStatus(400);
        // Create upload directory if not exists
        const uploadDir = __dirname + '/public/upload/private';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        try {
            register(req.body, image.name).then(() => {
                // Move the uploaded image to upload folder
                try {
                    image.mv(__dirname + '/public/upload/private/' + image.name);
                } catch (error) {
                    console.log(error);
                }
                res.redirect('/login');
            });
        } catch (error) {
            res.status(500).send({
                message: 'Something went wrong while registering a new account ...'
            })
        }
    });

    app.use('/registration', router);
}