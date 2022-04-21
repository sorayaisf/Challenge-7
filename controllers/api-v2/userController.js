const {
    UserGame
} = require('../../models')

exports.getAllUsers = async (req, res, next) => {
    const allUser = await UserGame.findAll();

    res.status(200).json({
        status: 'success',
        length: allUser.length,
        users: allUser,
    });
};