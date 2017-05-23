const defaultDataType = 'application/json';
const xml = require('xml');

exports.convertUserData = accept => {
  this.accept = accept;
  const funcIndex = {
    'application/json': showToJson,
    'text/xml': showToXml
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
 * @param res
 */
const showToJson = user => {
  return {
    id: user.id,
    name: user.pw,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

/**
 * 유저 데이터 가져오기 - XML
 *
 * @param user
 * @param res
 */
const showToXml = user => {
  return xml({
    user: [
      {id: user.id},
      {name: user.pw},
      {updatedAt: user.updatedAt.toISOString()},
      {createdAt: user.createdAt.toISOString()}
    ]
  });
};