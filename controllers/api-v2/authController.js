const {
    UserGame,
    UserGameBiodata
} = require('../../models')

const format = user => {
    const {
        id,
        username
    } = user
    return {
        id,
        username,
        tokenAccess: user.generateToken(),
    }
}

exports.register = async (req, res, next) => {
    try {
        if (
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.nationality ||
            !req.body.hobby
        )
            throw new Error(
                'Please input your biodata (firstName, lastName, nationality, hobby)'
            )

        const newUser = await UserGame.register(req.body)
        const newBiodata = await UserGameBiodata.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            hobby: req.body.hobby,
            userId: newUser.id,
        })

        res.status(201).json({
            status: 'success',
            user: newUser,
            biodata: newBiodata,
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            error: err.message,
            stack: err.stack,
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password)
            throw new Error('Please input username and password')

        const user = await UserGame.authenticate(req.body)

        res.status(200).json(format(user))
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            error: err.message,
            stack: err.stack,
        })
    }
}

exports.whoami = async (req, res, next) => {
    const currentUser = req.user
    res.status(200).json({
        status: 'success',
        currentUser,
    })
}