const express = require('express');
const router = express.Router();

router.get('/support', (req, res) => {
    res.render('support', { user: req.session.user });
});

module.exports = router;