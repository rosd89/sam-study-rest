const morgan = require('morgan');
const rotatingLogStream = require('file-stream-rotator')
  .getStream({
    filename: __dirname + "/log/app-%DATE%.log",
    frequency: "daily",
    verbose: false,
    date_format: "YYYY-MM-DD"
  });

/**
 * morgan wrapper
 * @returns {morgan}
 */
module.exports = _ => {
  morgan.token('request-body', (req, res) =>JSON.stringify({
    query: req.query,
    body: req.body,
    params: req.params
  }));

  morgan.token('response-body', (req, res) => res.body);

  return morgan('-^TIME[:date[iso]]-^METHOD[:method]-^URL[:url]-^HTTP_STATUS[:status]-^REQUEST_BODY[:request-body]-^RESPONSE_TIME[:response-time ms]-^RESPONSE_BODY[:response-body]', {
    stream: rotatingLogStream
  });
};

