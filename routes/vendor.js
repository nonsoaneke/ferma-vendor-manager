const express = require('express');
const router = express.Router();
const Keycloak = require('keycloak-connect');
const fs = require('fs');
const path = require('path');


const fileLocation = path.join(__dirname, "apis", "api.json");
const keycloak = new Keycloak({ });

function prepareFileData(data) {
    let result = data.toString();
    return JSON.parse(result);
}

router.get('/', keycloak.protect('realm:vendor'), async (req, res, next) => {
    console.log(fileLocation);
    
    fs.readFile(fileLocation, (err, data) => {
        // console.log(data);
        if(err) throw new Error(err);
        const appData = prepareFileData(data);
        console.log(appData);
        res.render('vendors/list-apis', { title: "APIs", data: appData });
    });
});

module.exports = router;