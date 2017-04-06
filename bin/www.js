const app = require('../app/index');
const port = 3000;

app.listen(port, () => {
    console.log('server start => port : ', port);
});