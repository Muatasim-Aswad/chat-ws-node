export const PORT = 8080;

export const CLIENT = {
  MESSAGE: {
    NEW_USER: 'NEW_USER',
    NEW_MESSAGE: 'NEW_MESSAGE',
  },
} as const;

export type MessageTypes = (typeof CLIENT.MESSAGE)[keyof typeof CLIENT.MESSAGE];

export interface MessagePayload {
  message: string;
}

export interface WebSocketMessage {
  type: MessageTypes;
  payload?: MessagePayload;
}
