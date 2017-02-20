const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

let clicks = 0; // Overall clicks on server

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updateClicks', (data) => {
    clicks += data;

    io.sockets.in('room1').emit('updated', clicks);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`Listening on port: ${port}`);
