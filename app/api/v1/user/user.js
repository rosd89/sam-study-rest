const router = require('express').Router();
const {
  index, show, userDuplicateChecker, create, update, patchAll, patch, destory
} = require('./user.controller.js');

// ----------------------------
// http://ip:port/api/v1/users
// ----------------------------

// 유저목록 가져오기 [0]
router.get('/', index);
// 특정 유저 데이터 가져오기
router.get('/:id', show);

// 유저 등록하기 [o]
router.post('/', userDuplicateChecker, create);

// 유저 전체데이터 수정
router.put('/:id', update);

// 유저 삭제하기
router.delete('/:id', destory);

module.exports = router;