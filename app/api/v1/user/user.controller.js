const userService = require('./user.service');
const {convertUserData, convertUsersData} = require('./user.util');

const retMsg = require('../util/return.msg');

/**
 * user 전체 리스트 가져오기 Controller
 *
 * @param req
 * @param res
 */
exports.index = (req, res) => {
  // 첫 페이지는 page 값이 0
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  if (isNaN(page) || page < 0) {
    return retMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', 'page');
  }
  else if (isNaN(size) || size < 1) {
    return retMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', 'size');
  }

  const {total, users, lastUpdatedAt} = userService.findAll(page, size);

  const accept = req.header('Accept');
  const convertVal = convertUsersData(accept);

  res.header('Last-Modified', lastUpdatedAt.toISOString());
  res.set('Content-Type', convertVal.accept);

  return retMsg.success200RetObj(res, convertVal.func(users, page, size, total));
};

/**
 * 특정 user 데이터 가져오기 Controller
 *
 * @param req
 * @param res
 */
exports.show = (req, res) => {
  const id = req.params.id;

  const user = userService.findOne(id);

  if (!user) {
    return retMsg.error404NotFound(res);
  }

  const accept = req.header('Accept');
  const convertVal = convertUserData(accept);

  res.header('Last-Modified', user.updatedAt.toISOString());
  res.set('Content-Type', convertVal.accept);

  return retMsg.success200RetObj(res, convertVal.func(user));
};

/**
 * 유정 등록하기 Controller
 *
 * @param req
 * @param res
 */
exports.create = (req, res) => {
  const {id, pw, name} = req.body;

  if (!id) {
    return retMsg.error400InvalidCall(res, 'ERROR_MISSING_PARAM', 'id');
  }
  else if (!pw) {
    return retMsg.error400InvalidCall(res, 'ERROR_MISSING_PARAM', 'pw');
  }
  else if (!name) {
    return retMsg.error400InvalidCall(res, 'ERROR_MISSING_PARAM', 'name');
  }

  const user = userService.create(id, pw, name);
  if (user.errorCode) {
    return retMsg.error400InvalidCall(res, user.errorCode, user.data);
  }

  const accept = req.header('Accept');
  const convertVal = convertUserData(accept);

  res.header('Last-Modified', user.updatedAt.toISOString());
  res.set('Content-Type', convertVal.accept);

  return retMsg.success201(res, convertVal.func(user))
};

/**
 * user 전체 데이터 수정 Controller
 *
 * @param req
 * @param res
 */
exports.update = (req, res) => {

};

/**
 * 전체 user 일부 데이터 수정 Controller
 *
 * @param req
 * @param res
 */
exports.patchAll = (req, res) => {

};

/**
 * 특정 user 일부 데이터 수정
 *
 * @param req
 * @param res
 */
exports.patch = (req, res) => {

};

/**
 * 특정 user 삭제 Controller
 *
 * @param req
 * @param res
 */
exports.destory = (req, res) => {

};

/**
 * 유저 중복 체크 Middle
 *
 * @param req
 * @param res
 * @param next
 */
exports.userDuplicateChecker = (req, res, next) => {
  const id = req.body.id;
  const findUser = userService.findOne(id);

  if (findUser.id) {
    return retMsg.error400InvalidCall(res, 'ERROR_DUPLICATE', 'id');
  }

  return next();
};