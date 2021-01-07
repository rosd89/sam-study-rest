const db = require('../../../helper/db')

const ACCOUNT = 'account'

const userFindById = id => {
  if (!id) {
    return Promise.reject('id 값이 없습니다.')
  }

  return db(ACCOUNT)
    .select('*')
    .andWhere('id', id)
    .then(([item]) => item)
}

const userCreate = user => {
  return db(ACCOUNT).insert(user)
}

module.exports = {
  userFindById, userCreate
}