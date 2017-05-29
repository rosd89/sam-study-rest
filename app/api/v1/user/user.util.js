const defaultDataType = 'application/json';
const xml2js = require('xml2js');
const builder = new xml2js.Builder();

const errorCodeMap = {
  ERROR_UNKNOWN: 0,
  ERROR_MISSING_PARAM: -1,
  ERROR_INVALID_PARAM: -2,
  ERROR_DUPLICATE: -3
};

/**
 * 유저 데이터 가져오기 Util
 *
 * @param accept
 * @returns {{accept: *, func: *}}
 */
exports.convertUserData = accept => {
  const funcIndex = {
    'application/json': userToJson,
    'application/xml': userToXml
  };

  if (!funcIndex[accept]) {
    accept = defaultDataType;
  }

  return {
    accept,
    func: funcIndex[accept]
  };
};

/**
 * 유저 목록 데이터 가져오기 Util
 *
 * @param accept
 * @returns {{accept: *, func: *}}
 */
exports.convertUsersData = accept => {
  const funcIndex = {
    'application/json': usersToJson,
    'application/xml': usersToXml
  };

  if (!funcIndex[accept]) {
    accept = defaultDataType;
  }

  return {
    accept,
    func: funcIndex[accept]
  };
};

exports.convertError400Data = accept => {
  const funcIndex = {
    'application/json': error400ToJson,
    'application/xml': error400ToXml
  };

  if (!funcIndex[accept]) {
    accept = defaultDataType;
  }

  return {
    accept,
    func: funcIndex[accept]
  };
};

/**
 * 유저 데이터 가져오기 - JSON
 *
 * @param user
 */
const userToJson = user => {
  return {
    id: user.id,
    name: user.name,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

/**
 * 유저 목록 데이터 가져오기 - JSON
 *
 * @param users
 */
const usersToJson = (users, page, size, total) => {
  return {
    page,
    size,
    total,
    users: users.map(user => {
      return {
        id: user.id,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
      }
    })
  };
};

/**
 * Http 400 Error Msg - JSON
 *
 * @param errorCode
 * @param data
 * @returns {{errorCode: *, data: *}}
 */
const error400ToJson = (errorCode, data) => {
  return {
    errorCode: errorCodeMap[errorCode],
    data: data // parameter name
  }
};

/**
 * 유저 데이터 가져오기 - XML
 *
 * @param user
 */
const userToXml = user => builder.buildObject({
  user: {
    id: user.id,
    name: user.name,
    updatedAt: user.updatedAt.toISOString(),
    createdAt: user.createdAt.toISOString()
  }
});

/**
 * 유저 목록 데이터 가져오기 - XML
 *
 * @param users
 */
const usersToXml = (users, page, size, total) => {
  const obj = users.map(user => {
    return {
      id: user.id,
      name: user.name,
      updatedAt: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString()
    }
  });

  return builder.buildObject({
    '$': {
      page, size, total
    },
    users: {
      user: obj
    }
  });
};

/**
 * Http 400 Error Msg - XML
 *
 * @param errorCode
 * @param data
 */
const error400ToXml = (errorCode, data) => builder.buildObject({
  error : {
    '$' : {
      errorCode: errorCodeMap[errorCode],
      data
    }
  }
});