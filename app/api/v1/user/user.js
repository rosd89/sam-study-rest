const router = require('express').Router();
const userCtrl = require('./user.controller.js');

// ----------------------------
// http://ip:port/api/v1/users
// ----------------------------

// 유저목록 가져오기 [0]
router.get('/', userCtrl.index);
// 특정 유저 데이터 가녀오기
router.get('/:id', userCtrl.show);

// 유저 등록하기 [o]
router.post('/', userCtrl.userDuplicateChecker, userCtrl.create);

// 유저 전체데이터 수정
router.put('/:id', userCtrl.update);

// 유저들의 특정 상태 값을 수정하기
router.patch('/', userCtrl.patchAll);
// 유저의 일부 값을 수정하기
router.patch('/:id', userCtrl.patch);

// 유저 삭제하기
router.delete('/:id', userCtrl.destory);

module.exports = router;