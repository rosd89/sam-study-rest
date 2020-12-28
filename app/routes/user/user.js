module.exports = function (id, salt, pw, name, enable, updatedAt, createdAt) {
  this.id = id;
  this.salt = salt;
  this.pw = pw;
  this.name = name;
  this.enable = enable;
  this.updatedAt = updatedAt;
  this.createdAt = createdAt;
};