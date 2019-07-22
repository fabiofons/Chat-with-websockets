const express = require('express');
const app = express();
const User = require('./model/User');
const Messages = require('./model/Messages');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chatbox", { useNewUrlParser: true });
app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users)
  } catch(err) {
    next(err)
  }
});

app.post('/api/users', async (req, res, next) => {
  try {
    const user = req.body.user;
    app.locals.user = user;
    const response = await User.create({user:user})
    res.status(200).json(response);
  } catch(err) {
    next(err);
  }
});

app.get('/api/messages', async (req, res, next) => {
  try {
    const messages = await Messages.find();
    res.json(messages);
  } catch(err) {
    next(err)
  }
});

const dateNow = () => {
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let d = new Date;
  let month = months[d.getMonth()];
  let day = d.getDate();
  let hour = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  let fecha = month.concat(" ",day," ",hour);
  return fecha;
}

io.on('connection', socket => {
  let login;

  socket.on('login', data => {
    login = data.user;
    console.log('conected: ', login);
    socket.broadcast.emit('user-connected', { user: login });
  });

  socket.on('disconnect', async () => {
    console.log(login)
    const response = await User.deleteOne({"user":login});
    console.log('disconected? ', response);
    io.emit('user-disconnected', { user: login });
  });

  socket.on('new-message', async msg => {
    await Messages.create(msg);
    io.emit('new-message', msg);
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT} ...`));

