const defaultDataType = 'application/json';
const xml2js = require('xml2js');
const builder = new xml2js.Builder();

/**
 * 유저 데이터 가져오기 Util
 *
 * @param accept
 * @returns {{accept: *, func: *}}
 */
exports.convertUserData = accept => {
  const funcIndex = {
    'application/json': userToJson,
    'text/xml': userToXml
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
  this.accept = accept;
  const funcIndex = {
    'application/json': usersToJson,
    'text/xml': usersToXml
  };

  if (!funcIndex[this.accept]) {
    this.accept = defaultDataType;
  }

  return {
    accept,
    func: funcIndex[this.accept]
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
