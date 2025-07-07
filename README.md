# WebSockets-ws Chat Application (TypeScript)

This is a simple WebSocket chat application converted from JavaScript to TypeScript using the `tsx` package for execution and hot reloading.

## Project Structure

- `server.ts` - Main server file (TypeScript)
- `public/index.ts` - Client-side TypeScript
- `public/index.js` - Compiled client-side JavaScript (auto-generated)
- `utils/constants.ts` - Shared constants and TypeScript interfaces
- `tsconfig.json` - TypeScript configuration

## Getting Started

To run this application, first open up a terminal. Then, run the commands below:

```sh
npm install
npm run start
```

For development with hot reloading:

```sh
npm run dev
```

This will:

1. Compile the client-side TypeScript to JavaScript
2. Start the server with `tsx` in watch mode for hot reloading

## Technology Stack

- **Runtime**: Node.js with `tsx` for TypeScript execution
- **Language**: TypeScript with ESM modules
- **WebSocket Library**: `ws`
- **Client**: Vanilla TypeScript (no framework)
- **Build**: Simple TypeScript compilation (no bundler needed)
