///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import { PORT, CLIENT } from './utils/constants.js';

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chatMemory: string[] = [];

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  let filePath = req.url === '/' ? '/public/index.html' : req.url;

  if (!filePath) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // Clean up the file path and ensure it exists
  const fullPath = path.join(__dirname, filePath);

  // Check if file exists before trying to serve it
  if (!fs.existsSync(fullPath)) {
    res.writeHead(404);
    res.end('File not found');
    return;
  }

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';
  else if (extname === '.ico') contentType = 'image/x-icon';

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(fullPath, 'utf8').pipe(res);
});

///////////////////////////////////////////////
////////////////// WS LOGIC ///////////////////
///////////////////////////////////////////////

// TODO
// Exercise 3: Create the WebSocket Server using the HTTP server
const wsServer = new WebSocketServer({ server });

// TODO
// Exercise 5: Respond to connection events
wsServer.on('connection', (socket, req: http.IncomingMessage) => {
  console.log(`New client connected: ${req.socket.remoteAddress}`);
  console.log('sending chat memory to new client');
  // Exercise 7: Send the chat memory to the new client
  if (chatMemory.length > 0)
    chatMemory.forEach((message) => {
      socket.send(message);
    });
  // Exercise 6: Respond to client messages
  socket.on('message', (data) => {
    const message: string = data.toString();
    // add the message to chat memory
    chatMemory.push(message);
    broadcast(message, socket);
  });
});
// Exercise 6: Respond to client messages
// Exercise 7: Send a message back to the client, echoing the message received
// Exercise 8: Broadcast messages received to all other clients

///////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
///////////////////////////////////////////////

function broadcast(data: String, socketToOmit: WebSocket): void {
  // TODO
  // Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!
  wsServer.clients.forEach((client) => {
    if (client !== socketToOmit && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  const address = server.address();
  const port = typeof address === 'string' ? PORT : address?.port || PORT;
  console.log(`Listening on: http://localhost:${port}`);
});
