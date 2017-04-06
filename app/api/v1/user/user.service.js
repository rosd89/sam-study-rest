const defaultDataType = 'application/json';

/**
 * 유저 데이터 가져오기 Service
 *
 * @param accept
 * @returns {{application/json: (function(*))}}
 */
exports.show = accept => {
    const funcIndex = {
        'application/json' : showToJson,
        'application/xml' : showToXml
    };

    if(!funcIndex[accept]){
        accept = defaultDataType;
    }

    return funcIndex[accept];
};

/**
 * 유저 데이터 가져오기 - JSON
 *
 * @param query
 * @param params
 * @param res
 */
const showToJson = (query, params, res) => {
    const {userId} = params;
    return res.json({userId});
};

/**
 * 유저 데이터 가져오기 - XML
 *
 * @param query
 * @param params
 * @param res
 */
const showToXml = (query, params, res) => {
    console.log(params);
};