const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'countries.json'));
const middlewares = jsonServer.defaults();
const PORT = 3000;

function getRandomSeconds(max) {
  return Math.floor(Math.random() * max * 1000);
}

server.use(function (req, res, next) {
  setTimeout(next, getRandomSeconds(3));
});

server.use(middlewares);
server.use(router);

server.get('/countries', function (req, res) {
  res.jsonp(res);
});

server.listen(PORT, () => {
  console.log('JSON Server is running on PORT:', PORT);
});