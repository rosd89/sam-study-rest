const {Router} = require('express')

const userModel = require('./user')

const router = Router()

let USER_DATA = [
  new userModel('red', '1111', '누구개1', 'enable', new Date(), new Date()),
  new userModel('blue', '1111', '누구개2', 'enable', new Date(), new Date()),
  new userModel('yellow', '1111', '아무개3', 'enable', new Date(), new Date()),
  new userModel('pink', '1111', '아무개4', 'enable', new Date(), new Date()),
  new userModel('black', '1111', '누구개5', 'disable', new Date(), new Date()),
  new userModel('gold', '1111', '아무개6', 'enable', new Date(), new Date())
]

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

// 유저 생성 API
router.post('/', (req, res) => {
  const {id, pw, name} = req.body
  if (!id) {
    res.status(400).json({message: '"id"가 입력되지 않았습니다.'})
    return
  }
  if (!pw) {
    res.status(400).json({message: '"pw"가 입력되지 않았습니다.'})
    return
  }
  if (!name) {
    res.status(400).json({message: '"name"가 입력되지 않았습니다.'})
    return
  }

  const target = USER_DATA.find(user => user.id === id)
  if (target) {
    res.status(400).json({message: '지금 요청하신 ID는 이미 존재하는 유저입니다.'})
    return
  }

  const now = new Date()
  const user = new userModel(id, pw, name, 'enable',now, now)
  USER_DATA.push(user)

  res.json({
    id: user.id,
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