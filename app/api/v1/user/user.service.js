
const defaultDataType = 'application/json';

/**
 * 유저 데이터 가져오기 Service
 *
 * @param accept
 * @returns {{application/json: (function(*))}}
 */
exports.show = accept => {
    const funcIndex = {
        'application/json' : (query, params, res) => {
            const {userId} = params;
            return res.json({userId});
        },
        'application/xml' : (query, params, res) => {
            console.log(params);
        }
    };

    if(!funcIndex[accept]){
        accept = defaultDataType;
    }

    return funcIndex[accept];
};