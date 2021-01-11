const db = require('../../../helper/db')

const ACCOUNT = 'account'

const paged = async (q, {key = 'id', fields = '*', page, pageSize, sort=key, order='descend'}) => {
  const offset = (+page - 1) * +pageSize
  const cq = q.clone()

  if (sort) {
    q.orderBy(sort, order === 'descend' ? 'desc' : 'arc')
  }

  return Promise.all([
    q.select(fields).limit(pageSize).offset(offset),
    cq.count({total: key})
  ]).then(([rows, [{total}]]) => ({
    page: +page,
    pageSize: +pageSize,
    total,
    items: rows
  }))
}

const userFindById = id => {
  if (!id) {
    return Promise.reject('id 값이 없습니다.')
  }

  return db(ACCOUNT)
    .select('*')
    .andWhere('id', id)
    .then(([item]) => item)
}

const userFindAll = ({name, page = 10, pageSize = 10}) => {
  const q = db(ACCOUNT)
    .andWhere('enable', 'enable')

  if (name) {
    q.andWhere('name', 'like', `%${name}%`)
  }

  return paged(q, {page, pageSize})
}

const userCreate = user => {
  return db(ACCOUNT).insert(user)
}

const userUpdate = (id, user) => {
  return db(ACCOUNT)
    .update(user)
    .andWhere('id', id)
}

module.exports = {
  userFindById,
  userFindAll,
  userCreate,
  userUpdate
}