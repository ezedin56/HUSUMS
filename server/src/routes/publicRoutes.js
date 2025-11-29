const express = require('express');
const router = express.Router();
const {
    getLeaders,
    submitProblem
} = require('../controllers/publicController');

router.get('/leaders', getLeaders);
router.post('/problems', submitProblem);

module.exports = router;
