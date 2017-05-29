// undefined 체크
exports.undefinedCheck = v => v === undefined ? false : true;

// 200 - success return x
exports.success200 = res => res.status(200).send();

// 200 - success return Model
exports.success200RetObj = (res, obj) => {
  res.body = JSON.stringify(obj);
  return res.status(200).send(obj);
};

// 201 - success create
exports.success201 = (res, obj) => {
  res.body = JSON.stringify(obj);
  return res.status(201).send(obj);
};

// 204 - success delete
exports.success204 = res => res.status(204).send();

// 400 - error 인자값 누락
exports.error400InvalidCall = (res, obj) => {
  res.body = JSON.stringify(obj);
  return res.status(400).send(obj);
};

// 401 - error 리소스 접근권한 없음
exports.error401Unauthorized = res => res.status(401).send();

// 403- error 리소스 접근권한 만료
exports.error403Expired = res => res.status(403).send();

// 404 - error 페이지 없음
exports.error404NotFound = res => res.status(404).send();

// 500 - internal server error 서버 error
exports.error500Server = (res, err) => {
  res.body = obj.toString();
  return res.status(500).send(err);
};