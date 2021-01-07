const {Router} = require('express')

const userModel = require('./user')
const service = require('./user.service')
const {getSalt, getExpiredTime, getHash} = require('../lib/hash')

const router = Router()

let USER_DATA = [
  new userModel('red', '68add1e4a6a8d4ae0c803a5a88debecf3ffe76437ba14735b1e3b141936941e7', 'aa1b86b930a10cf7a3dbb6f80a1be460e9a3738d062f8108d5040fa60b18a323', '누구개1', 'enable', new Date(), new Date()),
  new userModel('blue', '68add1e4a6a8d4ae0c803a5a88debecf3ffe76437ba14735b1e3b141936941e7', 'aa1b86b930a10cf7a3dbb6f80a1be460e9a3738d062f8108d5040fa60b18a323', '누구개2', 'enable', new Date(), new Date()),
  new userModel('yellow', '68add1e4a6a8d4ae0c803a5a88debecf3ffe76437ba14735b1e3b141936941e7', 'aa1b86b930a10cf7a3dbb6f80a1be460e9a3738d062f8108d5040fa60b18a323', '아무개3', 'enable', new Date(), new Date()),
  new userModel('pink', '68add1e4a6a8d4ae0c803a5a88debecf3ffe76437ba14735b1e3b141936941e7', 'aa1b86b930a10cf7a3dbb6f80a1be460e9a3738d062f8108d5040fa60b18a323', '아무개4', 'enable', new Date(), new Date()),
  new userModel('black', '68add1e4a6a8d4ae0c803a5a88debecf3ffe76437ba14735b1e3b141936941e7', 'aa1b86b930a10cf7a3dbb6f80a1be460e9a3738d062f8108d5040fa60b18a323', '누구개5', 'disable', new Date(), new Date()),
  new userModel('gold', '68add1e4a6a8d4ae0c803a5a88debecf3ffe76437ba14735b1e3b141936941e7', 'aa1b86b930a10cf7a3dbb6f80a1be460e9a3738d062f8108d5040fa60b18a323', '아무개6', 'enable', new Date(), new Date())
]

const connectStatus = {}

const userFindById = id => USER_DATA.find(user => {
  if (user.enable === 'disable') return false
  return user.id === id
})

// 유저 목록을 조회 API
router.get('/', (req, res) => {
  const page = req.query.page === undefined ? 1 : +req.query.page
  const pageSize = req.query.pageSize === undefined ? 2 : +req.query.pageSize
  const name = req.query.name

  if (isNaN(page)) {
    res.status(400).json({message: 'page의 값이 숫자가 아닙니다.'})
    return
  }
  if (isNaN(pageSize)) {
    res.status(400).json({message: 'pageSize의 값이 숫자가 아닙니다.'})
    return
  }

  const users = USER_DATA.filter(user => {
    if (user.enable === 'disable') return false

    if (name) {
      if (!user.name.includes(name)) return false
    }

    return true
  })

  const offset = (page - 1) * pageSize
  const items = users.slice(offset, offset + pageSize).map(({pw, enable, ...user}) => user)

  res.json({
    items,
    page,
    pageSize,
    total: users.length
  })
})

// 유저 생성 API
router.post('/', async (req, res) => {
  const {pw, name} = req.body
  if (!pw) {
    res.status(400).json({message: '"pw"가 입력되지 않았습니다.'})
    return
  }
  if (!name) {
    res.status(400).json({message: '"name"가 입력되지 않았습니다.'})
    return
  }

  const salt = getSalt()
  const user = {
    salt,
    pw: getHash(pw, salt),
    name,
    enabled: 'enable'
  }
  const [id] = await service.userCreate(user)

  res.json({
    id,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })
})

// 유저 로그인 API
router.post('/signin', (req, res) => {
  // 로그인 API 구현
  const {id, pw} = req.body
  const user = userFindById(id)
  if (!user) {
    res.status(404).json({})
    return
  }

  if (user.pw !== getHash(pw, user.salt)) {
    res.status(401).json({message: '입력하신 비밀번호가 올바르지 않습니다.'})
    return
  }

  const token = getSalt()
  const expired = getExpiredTime()
  connectStatus[id] = {
    token, expired
  }

  res.json({
    token, expired
  })
})

// 로그인이 되었는지 확인하는 미들웨어 생성
router.use('/:id', (req, res, next) => {
  const {id} = req.params
  if (!id) {
    res.status(404).json({})
  }

  const connection = connectStatus[id]
  if (!connection) {
    res.status(401).json({message: '해당 계정의 로그인 기록이 없습니다.'})
    return
  }

  const token = req.headers['_token_']
  if (!token) {
    res.status(401).json({message: 'token 정보를 입력해주세요.'})
    return
  }

  if (token !== connection.token) {
    res.status(401).json({message: 'token 정보가 올바르지않습니다.'})
    return
  }

  if (Date.now() > connection.expired) {
    res.status(401).json({message: '해당 계정의 로그인 접속시간이 만료되었습니다.'})
    return
  }

  // token 만료시간 갱신
  connection.expired = getExpiredTime()

  next()
})

// 유저 상세 조회 API
router.get('/:id', (req, res) => {
  const {id} = req.params
  const user = USER_DATA.find(user => {
    if (user.enable === 'disable') return false
    return user.id === id
  })
  if (!user) {
    res.status(404).json({})
    return
  }

  res.json({
    id,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })
})

// 유저 수정 API
router.patch('/:id', (req, res) => {
  const {id} = req.params
  const {pw, name, enable} = req.body
  const user = USER_DATA.find(user => {
    if (user.enable === 'disable') return false
    return user.id === id
  })
  if (!user) {
    res.status(404).json({})
    return
  }

  const updateData = []
  if (pw && user.pw !== pw) {
    updateData.push({key: 'pw', data: pw})
  }
  if (name && user.name !== name) {
    updateData.push({key: 'name', data: name})
  }
  if (enable && user.enable !== enable) {
    updateData.push({key: 'enable', data: enable})
  }

  if (updateData.length === 0) {
    res.status(400).json({message: '수정된 값이 존재하지 않습니다.'})
    return
  } else {
    updateData.push({key: 'updatedAt', data: new Date()})
  }

  updateData.forEach(({key, data}) => {
    user[key] = data
  })

  res.json({message: '유저데이터 수정에 성공하였습니다.'})
})

// 유저 삭제 API
router.delete('/:id', (req, res) => {
  const {id} = req.params
  const user = USER_DATA.find(user => {
    if (user.enable === 'disable') return false
    return user.id === id
  })
  if (!user) {
    res.status(404).json({})
    return
  }

  user.enable = 'disable'

  res.status(204).send()
})

module.exports = router
