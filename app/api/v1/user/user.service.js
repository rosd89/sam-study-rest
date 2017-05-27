const userData = require('./user.data');

// 유저 데이터를 저장하는 공간
let USER_DATA = [
  new userData('red', '1111', '아무개1', 'enable', new Date(), new Date()),
  new userData('blue', '1111', '아무개2', 'enable', new Date(), new Date()),
  new userData('yellow', '1111', '아무개3', 'enable', new Date(), new Date()),
  new userData('pink', '1111', '아무개4', 'enable', new Date(), new Date()),
  new userData('black', '1111', '아무개5', 'disable', new Date(), new Date()),
  new userData('gold', '1111', '아무개6', 'enable', new Date(), new Date())
];

/**
 * 유저 전체 리스트 데이터 가져오기 Service
 *
 * @param page
 * @param size
 * @returns {{totalCnt: Number, users: Array.<*>, lastUpdatedTime: (Date|*|string|updatedAt)}}
 */
exports.findAll = (page, size) => {
  const offset = page * size;

  const total = USER_DATA.length;
  const users = USER_DATA.filter(user => {
    return user.enable === 'enable'
  }).slice(offset, offset + size);

  const lastUpdatedAt = USER_DATA.sort((userA, userB) => {
    const aTime = userA.updatedAt.getTime();
    const bTime = userB.updatedAt.getTime();

    if (aTime > bTime) {
      return 1
    }
    else if (aTime < bTime) {
      return -1
    }
    return 0;
  })[0].updatedAt;

  console.log(lastUpdatedAt);
  return {
    total, users, lastUpdatedAt
  }
};

/**
 * 특정 User 데이터 가져오기 Service
 *
 * @param id
 */
exports.findOne = id => USER_DATA.filter(user => {
  // 활성화된 유저만 검색
  if (user.enable === 'disable') {
    return false;
  }

  return user.id === id;
})[0];

/**
 * User 추가 Service
 *
 * @param id
 * @param pw
 * @param name
 * @returns {{id: *, pw: *, name: *, updatedAt: Date, createdAt: Date}}
 */
exports.create = (id, pw, name) => {
  const user = new userData({
    id, pw, name,
    enable: 'enable',
    updatedAt: new Date(),
    createdAt: new Date()
  });

  USER_DATA.push(user);

  return {
    id: user.id,
    pw: user.pw,
    name: user.name,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

/**
 * 유저 정보 업데이트
 *
 * @param user
 */
exports.update = user => {
  const index = USER_DATA.map(function(e) { return e.hello; }).indexOf(user.id);

  try{
    USER_DATA[index] = user;
  } catch (err) {
    console.log(err);
    return 0;
  }

  return 1;
};

/**
 * 유저 삭제
 *
 * @param id
 */
exports.delete = id => {
  try{
    USER_DATA = USER_DATA.map(user => {
      return user.id !== id;
    });
  } catch (err) {
    console.log(err);
    return 0;
  }

  return 1;
};