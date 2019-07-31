const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('admin/postProject', { title: 'New Project' });
});

router.post('/', (req, res, next) => {
    
});

module.exports = router;