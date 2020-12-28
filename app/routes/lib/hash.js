const crypto = require('crypto')
const uuid = require('node-uuid')

const _getSalt = () => crypto.createHash('sha256').update(uuid.v1()).digest('hex')
exports.getSalt = _getSalt

const _getExpiredTime = () => {
  const expired = new Date()
  return expired.setMinutes(expired.getMinutes() + 120)
}
exports.getExpiredTime = _getExpiredTime

const _getHash = (hash, salt) => crypto.pbkdf2Sync(hash, salt, 10000, 32, 'sha256').toString('hex')
exports.getHash = _getHash

module.exports = {
  getSalt: _getSalt,
  getHash: _getHash,
  getExpiredTime: _getExpiredTime
}