const express = require('express')
const router = express.Router()
const adminControllers = require('../../controllers/api-v1/adminController')
const gameController = require('../../controllers/api-v1/gameController')

router.get('/', gameController.getIndexPage);

//User Login Routes
router.get('/login', adminControllers.getUserLogin);
router.post(
    '/login',
    adminControllers.userValidationLogin,
    adminControllers.postUserLogin
)

//User Register Routes
router.get('/signup', adminControllers.getUserSignUp);
router.post(
    '/signup',
    adminControllers.userValidationSignUp,
    adminControllers.postUserSignUp
)

//User Input Biodata Routes
router.get('/biodata/:id', adminControllers.getUserBiodataInput)
router.post('/biodata/:id', adminControllers.postUserBiodataInput)

// Game Single Player
router.get('/game/score/:id', gameController.getGameScore)
router.post('/game/score/:id', gameController.postGameScore)
router.get('/game/:id', gameController.getGame)

// Admin Dashboard Routes
router.get('/dashboard', adminControllers.getAdminDashboard);
router.get('/dashboard/details/:id', adminControllers.getUserDetails)
router.get('/dashboard/edit/:id', adminControllers.getEditUser)
router.post('/dashboard/update/:id', adminControllers.putEditUser)
router.get('/dashboard/delete/:id', adminControllers.getDeleteUser)

module.exports = router;