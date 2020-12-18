const {Router} = require('express')

const user = require('./user')

const router = Router()

router.use('/user', user)

// default route
router.use((req, res) => res.status(404).send())

module.exports = router