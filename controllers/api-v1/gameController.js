const {
    UserGame,
    UserGameBiodata,
    UserGameHistory,
} = require('../../models')


exports.getGame = (req, res, next) => {
    const title = 'Game';
    const style = 'game.css';
    const id = req.params.id;
    res.render('game', {
        title,
        style,
        id,
    })
}

exports.getGameScore = (req, res, next) => {
    const userId = req.params.id
    UserGameHistory.findAll({
            where: {
                userId: userId
            }
        })
        .then(games => {
            res.render('histories/score', {
                title: 'Score',
                style: 'dashboard.css',
                games,
                userId,
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postGameScore = (req, res, next) => {
    const {
        userId,
        score
    } = req.body
    UserGameHistory.create({
            userId,
            score
        })
        .then(games => {
            const userId = games.userId
            res.redirect(`/api/v1/admin/game/score/${userId}`)
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getIndexPage = (req, res, next) => {
    res.render('index', {
        title: 'Home Page',
        style: 'index.css',
        id: req.params.id
    })
}