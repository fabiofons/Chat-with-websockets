const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  secret: 'Ciclismo',
  maxAge: 3 * 60 * 1000
}));

app.locals.users = [];
app.locals.messages = [];

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/chat', (req, res) => {
  let user = req.body.nickname;
  req.session.userName = user;

  const users = app.locals.users.filter(u => u !== user);
  res.render('index', { user, users, messages: app.locals.messages });
})

io.on('connection', socket => {
  let login;

  socket.on('login', data => {
    const user = data.user;
    app.locals.users.push(user);
    login = user;

    socket.broadcast.emit('user-connected', { user: login });
    console.log('conected: ', login)
  });

  socket.on('disconnect', () => {
    console.log("Disconnected: ", login);
    app.locals.users.splice(app.locals.users.indexOf(login), 1);
    io.emit('user-disconnected', { user: login });
  });

  socket.on('new-message', msg => {
    app.locals.messages.push(msg);
    io.emit('new-message', msg);
  });
});

http.listen(3000, () => console.log('listening on *:3000'));
