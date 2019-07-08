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
  maxAge: 10 * 60 * 1000
}));

app.locals.users = [];
const users = app.locals.users;
app.locals.messages = [];
const messages = app.locals.messages;

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/chat', (req, res) => {
  req.session.userName = req.body.nickname;
  let user = req.body.nickname;
  res.render('index',{ user, users, messages });
  users.unshift(user);
})

io.on('connection', (socket) => {
  let login = {};
  login[socket.id] = users[0];
  io.emit('chat-conection', { conection:`${login[socket.id]} is conected`, users:users })
  console.log('conected: ', socket.id)

  socket.on('disconnect', () => {
    io.emit('chat-conection', { conection:`${login[socket.id]} is desconected` });
    users.splice(users.indexOf(login[socket.id]), 1);
    io.emit('user-update', { toDelete: login[socket.id] })
  });

  socket.on('chat-to-server', msg => {
    messages.push(msg);
    io.emit('chat-from-server', msg);
  });  
});

http.listen(3000, () => console.log('listening on *:3000'));