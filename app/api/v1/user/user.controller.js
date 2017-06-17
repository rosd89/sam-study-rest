const userService = require('./user.service');
const {convertUserData, convertUsersData, convertError400Data} = require('./user.util');

const retMsg = require('../util/return.msg');
const {errorLog} = require('../../../logger/logger.morgan');

/**
 * user 전체 리스트 가져오기 Controller
 *
 * @param req
 * @param res
 */
exports.index = (req, res) => {
  const accept = req.header('Accept');
  // 첫 페이지는 page 값이 0
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  if (isNaN(page) || page < 0) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_INVALID_PARAM', 'page'));
  }
  else if (isNaN(size) || size < 1) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_INVALID_PARAM', 'size'));
  }

  const {total, users, lastUpdatedAt} = userService.findAll(page, size);

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
  const {id} = req.params;

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
  const accept = req.header('Accept');
  const {id, pw, name} = req.body;

  if (!id) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_MISSING_PARAM', 'id'));
  }
  else if (!pw) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_MISSING_PARAM', 'pw'));
  }
  else if (!name) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_MISSING_PARAM', 'name'));
  }

  const user = userService.create(id, pw, name);
  if (user.errorCode) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func(user.errorCode, user.data));
  }

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
  const accept = req.header('Accept');
  const {id} = req.params;
  const {pw, name} = req.body;

  if (!pw) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_MISSING_PARAM', 'pw'));
  }
  else if (!name) {
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_MISSING_PARAM', 'name'));
  }

  const user = userService.findOne(id);
  if (!user) {
    return retMsg.error404NotFound(res);
  }

  user.pw = pw;
  user.name = name;
  user.updatedAt = new Date();

  return userService.update(user) === 1 ?
    retMsg.success200(res) :
    retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_UNKNOWN'));
};

/**
 * 특정 user 삭제 Controller
 *
 * @param req
 * @param res
 */
exports.destroy = (req, res) => {
  const accept = req.header('Accept');
  const {id} = req.params;

  return userService.delete(id) === 1 ?
    retMsg.success200(res) :
    retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_UNKNOWN'));
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
    const accept = req.header('Accept');
    return retMsg.error400InvalidCall(res, convertError400Data(accept).func('ERROR_MISSING_PARAM', 'id'));

  }

  return next();
};