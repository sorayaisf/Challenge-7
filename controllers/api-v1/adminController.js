const {
    check,
    body,
    validationResult
} = require('express-validator')

const {
    UserGame,
    UserGameBiodata
} = require('../../models')
const bcrypt = require('bcrypt')


//User Sign Up
exports.getUserSignUp = (req, res, next) => {
    res.render('signup', {
        title: 'Sign Up',
        style: 'login.css'
    })
}

exports.userValidationSignUp = [
    body('username').custom(async value => {
        const duplicate = await UserGame.findOne({
            where: {
                username: value
            }
        })
        if (duplicate) {
            throw new Error('Username already exist')
        }
        return true
    }),

    check('email', 'Email invalid, ex: name@example.com').isEmail(),
    body('email').custom(async value => {
        const duplicate = await UserGame.findOne({
            where: {
                email: value
            }
        })
        if (duplicate) {
            throw new Error('Email already exist')
        }
        return true
    }),
]

exports.postUserSignUp = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('signup', {
            title: 'Sign Up',
            style: 'login.css',
            errors: errors.array(),
        })
    } else {
        const {
            username,
            email,
            password
        } = req.body
        const encryptedPassword = bcrypt.hashSync(password, 10)
        UserGame.create({
                username,
                email,
                password: encryptedPassword
            })
            .then(result => {
                const id = result.dataValues.id
                res.redirect(`/api/v1/admin/biodata/${id}`)
            })
            .catch(err => {
                console,
                log(err)
            })
    }

}

//User Login
exports.getUserLogin = (req, res, next) => {
    res.render('login', {
        title: 'Login',
        style: 'login.css'
    })
}

exports.userValidationLogin = body('username').custom(
    async (value, {
        req
    }) => {
        const user = await UserGame.findOne({
            where: {
                username: value
            }
        })
        const result = bcrypt.compareSync(req.body.password, user.password)
        if (!user) {
            throw new Error('Invalid Username')
        } else if (!result) {
            throw new Error('Wrong password')
        } else {
            return true
        }
    }
)

exports.postUserLogin = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('login', {
            title: 'Login',
            style: 'login.css',
            errors: errors.array(),
        })
    }

    const username = req.body.username
    const admin = await UserGame.findOne({
        where: {
            username
        }
    })
    if (admin) {
        res.redirect('/api/v1/admin/dashboard')
    } else {
        UserGame.findOne({
                where: {
                    username
                }
            })
            .then(user => {
                res.redirect(`/api/v1/admin/game/${user.id}`)
            })
            .catch(err => {
                console.log(err)
            })
    }
}

//User Biodata
exports.getUserBiodataInput = (req, res, next) => {
    res.render('biodata/biodata', {
        title: 'Fill in Biodata',
        style: 'login.css',
        userId: req.params.id
    })
}

exports.postUserBiodataInput = async (req, res, next) => {
    const {
        firstName,
        lastName,
        nationality,
        hobby,
        userId
    } = req.body
    UserGameBiodata.create({
            firstName,
            lastName,
            nationality,
            hobby,
            userId,
        })
        .then(result => {
            res.redirect('/api/v1/admin/login')
        })
        .catch(err => {
            console.log(err)
        })
}

//Admin Dashboard
exports.getAdminDashboard = (req, res, next) => {
    UserGame.findAll()
        .then(users => {
            res.render('users/dashboard', {
                title: 'Dashboard',
                style: 'dashboard.css',
                users,
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getUserDetails = async (req, res, next) => {
    const userId = req.params.id
    const user = await UserGame.findOne({
        where: {
            id: userId
        }
    })
    const biodata = await UserGameBiodata.findOne({
        where: {
            userId
        }
    })
    res.render('users/details', {
        title: 'Details',
        style: 'dashboard.css',
        user,
        biodata,
    })
}

exports.getEditUser = async (req, res, next) => {
    const userId = req.params.id
    const user = await UserGame.findOne({
        where: {
            id: userId
        }
    })
    const biodata = await UserGameBiodata.findOne({
        where: {
            userId
        }
    })

    res.render('users/user-edit', {
        title: 'Edit Page',
        style: '',
        user,
        biodata,
        userId,
    })
}

exports.putEditUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            nationality,
            hobby
        } = req.body
        const encryptedPassword = bcrypt.hashSync(password, 10)

        await UserGame.update({
            username,
            email,
            password: encryptedPassword
        }, {
            where: {
                id: userId
            }
        })
        await UserGameBiodata.update({
            firstName,
            lastName,
            nationality,
            hobby

        }, {
            where: {
                userId
            }
        })

        res.redirect('/api/v1/admin/dashboard')
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
}

exports.getDeleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = UserGame.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404)
            res.render('alert')
        } else {
            await UserGame.destroy({
                where: {
                    id: userId
                }
            })
            await UserGameBiodata.destroy({
                where: {
                    userId
                }
            })
            res.redirect('/api/v1/admin/dashboard')
        }
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
}