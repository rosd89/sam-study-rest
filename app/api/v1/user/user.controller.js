const userService = require('./user.service.js');

/**
 * user 전체 리스트
 *
 * @param req
 * @param res
 */
exports.index = (req, res) => {

};

/**
 * 특정 user 데이터 가져오기
 *
 * @param req
 * @param res
 */
exports.show = (req, res) => {
    const accept = req.header('Accept');
    return userService.show(accept)(req.query, req.params, res);
};

/**
 * 유정 등록하기
 *
 * @param req
 * @param res
 */
exports.create = (req, res) => {

};

/**
 * user 전체 데이터 수정
 *
 * @param req
 * @param res
 */
exports.update = (req, res) => {

};

/**
 * 전체 user 일부 데이터 수정
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
 * 특정 user 삭제
 *
 * @param req
 * @param res
 */
exports.destory = (req, res) => {

};