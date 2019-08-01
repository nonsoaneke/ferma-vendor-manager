const express = require('express');
const Keycloak = require('keycloak-connect');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const prepareFileData = require('../lib/dataPrep').prepareFileData;

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

const fileLocation = path.join(__dirname, "apis", "api.json");
const keycloak = new Keycloak({ });

router.get('/', (req, res, next) => {
    res.render('admin/postProject', { title: 'New Project' });
});

const validation = [check('name').isEmpty(), check('description').isEmpty()];

function searchData(data, name) {
    data.forEach((element, index) => {
        if(name === element) {
            return true;
        }
        return false;
    });
}

router.post('/', upload.single('projectSpec'), check('name').isEmpty(), check('description').isEmpty(), (req, res, next) => {
    const { name, description } = req.body;
    const { file } = req;
    console.log(file);
    const errors = validationResult(req);
    const specLocation = path.join(__dirname, 'apis', 'api.json');
    fs.readFile(specLocation, (err, data) => {
        if(err) throw new Error(err);
        const preparedData = prepareFileData(data);
        const searchedData = searchData(data, name);
        if(searchedData) {
            res.send('error', { message: 'Project Already Exists'});
        }
        const newData = preparedData.push({ name, description, fileName: file.path });
        fs.writeFile(specLocation, newData, );
        res.send("Data written successfully");
    });
    if(!errors.isEmpty()) {
        return res.render('error', { title: "File Upload failure" });
    }
    res.render('admin/postProject', { title: "File upload success" });
});

router.get('/test', (req, res, next) => {
    const specLocation = path.join(__dirname, 'apis', 'api.json');
    res.send(specLocation);
})
module.exports = router;