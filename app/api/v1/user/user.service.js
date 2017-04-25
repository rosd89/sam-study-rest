const defaultDataType = 'application/json';
const xml = require('xml');

/**
 * 유저 데이터 가져오기 Service
 *
 * @param accept
 * @returns {{application/json: (function(*))}}
 */
exports.show = accept => {
    const funcIndex = {
        'application/json': showToJson,
        'text/xml': showToXml
    };

    if (!funcIndex[accept]) {
        accept = defaultDataType;
    }

    return funcIndex[accept];
};

/**
 * 유저 데이터 가져오기 - JSON
 *
 * @param user
 * @param res
 */
const showToJson = (user, res) => {
    return res.json({
        id: user.id,
        name: user.pw,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    });
};

/**
 * 유저 데이터 가져오기 - XML
 *
 * @param user
 * @param res
 */
const showToXml = (user, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(xml({
        user: [
            {id: user.id},
            {name: user.pw},
            {updatedAt: user.updatedAt.toISOString()},
            {createdAt: user.createdAt.toISOString()}
        ]
    }));
};