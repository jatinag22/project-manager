const express = require('express')
const memberController = require('../controllers/member')

const router = express.Router({mergeParams: true})

router.get('/', memberController.viewMembers)
router.post('/', memberController.addMembers)
router.put('/', memberController.removeMembers)

module.exports = router