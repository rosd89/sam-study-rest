const router = require('express').Router();
const userCtrl = require('./user.controller.js');

router.get('/', userCtrl.index);
router.get('/:userId', userCtrl.show);

router.post('/', userCtrl.create);

router.put('/:userId', userCtrl.update);

router.patch('/', userCtrl.patchAll);
router.patch('/:userId', userCtrl.patch);

router.delete('/:userId', userCtrl.destory);

module.exports = router;