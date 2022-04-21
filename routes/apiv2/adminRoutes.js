const express = require('express')
const router = express.Router()

const userController = require('../../controllers/api-v2/userController')
const authController = require('../../controllers/api-v2/authController')
const roomController = require('../../controllers/api-v2/roomController')
const restrict = require('../../helpers/restrict')

router.route('/allUsers').get(restrict, userController.getAllUsers)
router.route('/allRooms').get(restrict, roomController.getAllRooms)

module.exports = router;