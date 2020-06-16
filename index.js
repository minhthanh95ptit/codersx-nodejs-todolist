var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var low = require('lowdb');
var shortId = require('shortid');

var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');

db = low(adapter);

db.defaults({ todos: [] })
  .write();

var todosDb = db.get('todos');

var port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send("Hello codersx");
})


app.get('/todos', function (req, res) {
  res.render('index', {
    todos: todosDb.value()
  })
})

app.get('/todos/search', function (req, res) {
  var q = req.query.q;
  var mathchedTodos = todosDb.value().filter(function (todo) {
    return todo.name.toLowerCase().indexOf(q.toLocaleLowerCase()) != -1
  });
  res.render('index', {
    todos: mathchedTodos,
    q: q
  })
  console.log(req.query);
})

app.get('/todos/create', function (req, res) {
  res.render('todos/create')

})

app.get('/todos/:id', function (req, res) {
  var id = req.params.id;

  var todo = todosDb.find({ id: id }).value();

  res.render('todos/view', {
    todo: todo
  })
})

app.get('/todos/:id/delete', function (req, res) {
  var id = req.params.id;

  var todo = todosDb.remove({ id: id }).write();

  res.redirect('/todos')
})

app.post('/todos/create', function (req, res) {
  req.body.id = shortId.generate();
  console.log(req.body);
  todosDb.push(req.body).write();
  // res.redirect('/todos');
  res.redirect('/todos')
})

app.listen(3000, function () {
  console.log('Server running at port', port)
})