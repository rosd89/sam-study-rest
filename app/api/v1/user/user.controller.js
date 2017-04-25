const userService = require('./user.service');

const retMsg = require('../util/return.msg');

const userData = function (user) {
    this.id = user.id;
    this.pw = user.pw;
    this.name = user.name;
    this.enable = user.enable;
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
};

// 유저 데이터를 저장하는 공간
const users = [];

/**
 * user 전체 리스트
 *
 * @param req
 * @param res
 */
exports.index = (req, res) => {
    const {page, size} = req.query;


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

    const user = new userData({
        id, pw, name,
        enable: 'enable',
        updatedAt: new Date(),
        createdAt: new Date()
    });

    users.push(user);

    return retMsg.success201(res, {
        id: user.id,
        pw: user.pw,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    });
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

/**
 * 유저 중복 체크 middle
 *
 * @param req
 * @param res
 * @param next
 */
exports.userDuplicateChecker = (req, res, next) => {
    const id = req.body.id;

    const findUser = users.filter(user => {
        return id === user.id
    });

    if (findUser.length > 0) {
        return retMsg.error400InvalidCall(res, 'ERROR_DUPLICATE', 'id');
    }

    return next();
};