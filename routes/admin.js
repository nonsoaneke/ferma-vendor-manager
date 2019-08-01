const express = require('express');
const Keycloak = require('keycloak-connect');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
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

router.post('/', upload.single('projectSpec'), (req, res, next) => {
    const { name, description } = req.body;
    const { file } = req;

    console.log(file);
    
});

module.exports = router;