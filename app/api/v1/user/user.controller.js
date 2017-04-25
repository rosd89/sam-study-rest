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
const users = [
    new userData({
        id: 'red',
        pw: '1111',
        name: '아무개1',
        enable: 'enable',
        updatedAt: new Date(),
        createdAt: new Date()
    }),
    new userData({
        id: 'blue',
        pw: '1111',
        name: '아무개2',
        enable: 'enable',
        updatedAt: new Date(),
        createdAt: new Date()
    }),
    new userData({
        id: 'yellow',
        pw: '1111',
        name: '아무개3',
        enable: 'enable',
        updatedAt: new Date(),
        createdAt: new Date()
    }),
    new userData({
        id: 'pink',
        pw: '1111',
        name: '아무개4',
        enable: 'enable',
        updatedAt: new Date(),
        createdAt: new Date()
    }),
    new userData({
        id: 'black',
        pw: '1111',
        name: '아무개5',
        enable: 'disable',
        updatedAt: new Date(),
        createdAt: new Date()
    }),
    new userData({
        id: 'gold',
        pw: '1111',
        name: '아무개6',
        enable: 'enable',
        updatedAt: new Date(),
        createdAt: new Date()
    })
];

/**
 * user 전체 리스트
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

    const offset = page * size;

    const findUsers = users.filter(user => {
        return user.enable === 'enable'
    }).slice(offset, offset + size);

    const lastUpdatedTime = users.sort((userA, userB) => {
        const aTime = userA.updatedAt.getTime();
        const bTime = userB.updatedAt.getTime();

        if (aTime > bTime) {
            return 1
        }
        else if (aTime < bTime) {
            return -1
        }
        return 0;
    })[0];

    res.header('Last-Modified', lastUpdatedTime.updatedAt.toISOString());

    return retMsg.success200RetObj(res, {
        totalCnt: users.length,
        row: findUsers
    });
};

/**
 * 특정 user 데이터 가져오기
 *
 * @param req
 * @param res
 */
exports.show = (req, res) => {
    const id = req.params.id;

    const findUser = users.filter(user => {
        // 활성화된 유저만 검색
        if (user.enable === 'disable') {
            return false;
        }

        return user.id === id;
    })[0];

    if (!findUser) {
       return retMsg.error404NotFound(res);
    }

    const accept = req.header('Accept');
    res.header('Last-Modified', findUser.updatedAt.toISOString());

    return userService.show(accept)(findUser, res);
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