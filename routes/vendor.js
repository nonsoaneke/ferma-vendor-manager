const express = require('express');
const router = express.Router();
const Keycloak = require('keycloak-connect');
const fs = require('fs');
const path = require('path');

const prepareFileData = require('../lib/dataPrep').prepareFileData;


const fileLocation = path.join(__dirname, "apis", "api.json");
const keycloak = new Keycloak({ });



router.get('/', keycloak.protect('realm:vendor'), async (req, res, next) => {   
    fs.readFile(fileLocation, (err, data) => {
        if(err) throw new Error(err);
        const appData = prepareFileData(data);
        console.log(appData);
        res.render('vendors/list-apis', { title: "APIs", data: appData });
    });
});

module.exports = router;