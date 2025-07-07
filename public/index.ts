////////////////////////////////////////////////
////////////// VARIABLES ///////////////////////
////////////////////////////////////////////////

import {
  MessagePayload,
  MessageTypes,
  WebSocketMessage,
  PORT,
} from '../utils/constants.js';

// This variable will hold the WebSocket client connection.
// Initialize in the init() function
let wsClient: WebSocket | null = null;

////////////////////////////////////////////////
//////////////// DOM SETUP /////////////////////
////////////////////////////////////////////////

const messageBox = document.querySelector('#messageBox') as HTMLInputElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;

// Event handler when the client enters a message
messageForm.onsubmit = function (e: Event) {
  e.preventDefault();

  // Get the message from the messageBox
  const message = messageBox.value;
  // Render the sent message on the client as your own and reset the messageBox
  showMessageSent(message);
  messageBox.value = '';

  sendMessageToServer(message);
};

////////////////////////////////////////////////
////////////// WS CLIENT LOGIC /////////////////
////////////////////////////////////////////////

function init() {
  /* Note: 
      Though the conditional block below is not necessary, it is a best practice to avoid
      tampering with a cluttered namespace.
      */

  // If a WebSocket connection exists already, close it
  if (wsClient) {
    wsClient.onerror = wsClient.onopen = wsClient.onclose = null;
    wsClient.close();
  }

  // TODO:
  // Exercise 4: Create a new WebSocket connection with the server using the ws protocol.
  const URL = 'ws://localhost:' + PORT;
  wsClient = new WebSocket(URL);

  // TODO:
  // Exercise 5: Respond to connections by defining the .onopen event handler.
  wsClient.onopen = (event) => {
    showMessageReceived('WebSocket connection established :)');
    wsClient?.send(formatMessage('NEW_USER'));
  };

  // TODO:
  // Exercise 7: Respond to messages from the server by defining the .onmessage event handler
  wsClient.onmessage = function (this: WebSocket, event: MessageEvent) {
    const message: WebSocketMessage = JSON.parse(event.data);
    switch (message.type) {
      case 'NEW_USER':
        showMessageReceived(`New user joined`);
        break;
      case 'NEW_MESSAGE':
        showMessageReceived(message?.payload?.message || 'No message content');
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  };
  // Exercise 9: Parse custom message types, formatting each message based on the type.

  /* Note:
      The event handlers below are useful for properly cleaning up a closed/broken WebSocket client connection.
      To read more about them, check out the WebSocket API documentation: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
      */

  // .onclose is executed when the socket connection is closed
  wsClient.onclose = (event: CloseEvent) => {
    showMessageReceived('No WebSocket connection :(');
    wsClient = null;
  };

  // .onerror is executed when error event occurs on the WebSocket connection
  wsClient.onerror = (event: Event) => {
    console.error('WebSocket error observed:', event);
    wsClient = null;
  };
}

function sendMessageToServer(message: string): void {
  // Make sure the client is connected to the ws server
  if (!wsClient) {
    showMessageReceived('No WebSocket connection :(');
    return;
  }

  // TODO:
  // Exercise 6: Send the message from the messageBox to the server
  wsClient.send(formatMessage('NEW_MESSAGE', message));
  // Exercise 9: Send the message in a custom message object with .type and .payload properties
}

function formatMessage(
  type: MessageTypes,
  message?: string,
  payload?: MessagePayload,
): string {
  // Format the message as a JSON string with type and payload
  if (payload && message) payload.message = message;
  if (!payload && message) {
    payload = { message };
  }

  const messageObject: WebSocketMessage = {
    type,
    payload,
  };

  return JSON.stringify(messageObject);
}
////////////////////////////////////////////////
//////////// DOM HELPER FUNCTIONS //////////////
////////////////////////////////////////////////

const messages = document.querySelector('.chat') as HTMLElement;

// These functions are just aliases of the showNewMessage function
function showMessageSent(message: string): void {
  showNewMessage(message, 'sending');
}
function showMessageReceived(message: string): void {
  showNewMessage(message, 'receiving');
}

// This function displays a message in the messages container node.
// className may either be 'mine' or 'yours' (see styles.css for the distinction)
function showNewMessage(message: string, className: string): void {
  // Create a text node element for the message
  const textNode = document.createElement('div');
  textNode.innerHTML = message;
  textNode.className = 'message';

  // Wrap the text node in a message element
  const messageNode = document.createElement('div');
  messageNode.className = 'messages ' + className;
  messageNode.appendChild(textNode);

  // Append the messageNode to the messages container element
  messages.appendChild(messageNode);
  messages.scrollTop = messages.scrollHeight;
}

// Start the WebSocket server
init();
