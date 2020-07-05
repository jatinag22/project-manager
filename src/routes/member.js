const express = require('express')
const memberController = require('../controllers/member')

const router = express.Router({mergeParams: true})

router.get('/', memberController.viewMembers)
router.patch('/', memberController.updateMembers)

module.exports = router