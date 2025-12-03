# Chat App — Project Documentation

Date: 2025-12-03

This document describes the frontend `chat-app` project contained in `src/` (React + Vite). It explains the architecture, main files, state management, socket event contracts the client expects, how to run the app, and recommended next steps.

---

## Quick Summary
- Frontend: React (JSX) with Zustand for client state, vanilla CSS (component-level .css files).
- Real-time: Socket.IO client (`src/Utils/SocketServices.js` + `src/Utils/SocketListner.jsx`) — expects a backend Socket.IO server on `http://localhost:5050`.
- Routing: `react-router` routes defined in `src/main.jsx` (`/`, `/chat`, `/signup`, `/login`).

---

## How to run (frontend)
1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start the dev server (Vite):

   ```powershell
   npm run dev
   ```

3. Backend: many socket calls expect a Socket.IO server at `http://localhost:5050`. There is no fully working server in the repository; start or implement one that matches the socket contract described below and REST endpoints used in `src/Utils/Handlers.jsx` (e.g. `/login`, `/signup`, `/id`).

---

## Project structure (key files under `src/`)
- `main.jsx` — app entry, routes.
- `index.css` — global styles and variables.
- `App.jsx` — root route logic (redirects to `/chat` when logged in). Simple auth redirect logic.
- `Home.jsx` — main chat UI for logged-in users; composes the layout (left settings, right chat) and wires message input.

Components (under `src/Components/`):
- `Username/Username.jsx` — user name display and logout action.
- `Signup/Signup.jsx`, `Login/Login.jsx` — auth forms that call REST handlers.
- `Search/Search.jsx` — search users by ID and send requests.
- `Savedrooms/Savedrooms.jsx` — lists stored rooms from Zustand, join/delete room helpers.
- `Profile/Profile.jsx` — toggles for private/invite/save chat preferences.
- `Funarea/Funarea.jsx` — UI for creating/discovering/joining rooms.
- `CreateRoom/CreateRoom.jsx` — modal to create a new room (emits socket event via `SocketServices`).
- `DiscoverRooms/DiscoverRooms.jsx` — modal that lists public rooms and joins.
- `ChatSettings/ChatSettings.jsx` — toggles and updates room settings.
- `ChatInfo/ChatInfo.jsx` — displays current room id.
- `Messages/`, `Participents/` — UI to render messages and participants.

Utilities (under `src/Utils/`):
- `Store.jsx` — all client stores using Zustand (persist where useful). This holds messages, rooms, participants, and UI toggles.
- `SocketServices.js` — socket client wrapper that exports `socket` and helper functions used across components (e.g., `sendMessage_S`, `CreateRoom_S`).
- `SocketListner.jsx` — `SocketManager` React component that connects the socket and registers event handlers that update Zustand stores.
- `Handlers.jsx` — helper functions that call the backend REST API (`/login`, `/signup`, `/id`) using Axios.

Assets (icons, SVGs) are in `src/assets/`.

---

## State management (Zustand stores)
`src/Utils/Store.jsx` defines several stores. Important ones:

- `UserName_G` — current username and setter.
- `UserId_G` — user id setter (not heavily used across code).
- `JoinedRoomId_G` — the currently joined room id and setter.
- `SearchId_result_G` — result of ID search (id + availability boolean).
- `Received_Request_Data_G` — stores a received invitation request (sender id and room id).
- `ServerConnected_G` — boolean for socket connection status.
- `Messages_G` — persisted map of roomId -> messages array. API: `addMessage(roomId, message)`, `setMessages(roomId, newMessages)`, `clearMessages(roomId)`.
- `Participants_G` — map roomId -> participant lists and helpers.
- `Rooms_G` — persistent store of known rooms with helpers to add/del/update.
- `DiscoverRoomsList_G` — list of public rooms returned from server.
- `ProfileBtns_G` — persistent toggles for profile settings (private/invite/save chat).
- `ActionBtns_G` — UI toggles for showing create/discover UI overlays.

These stores are used by components to read/update global state without prop drilling.

---

## Socket (expected) contract and events — client side perspective
The frontend expects a Socket.IO server with the following events (emit/listen). This is important to implement a backend compatible with this UI.

Client emits (see `SocketServices.js` and other components):
- `checkId` (payload: id string) — ask server whether user ID exists/available.
- `setUsername` / `updateUser` — set/update username/profile flags. (payload: username, data)
- `sendMessage` / `sendMessage` (two styles exist in project):
  - `sendMessage` (helper in SocketServices) expects data object: { roomId, msg, sender, timestamp }
  - In some places components call `socket.emit('message', { chatId, text, sender })` — be aware both styles appear.
- `sendRequest` — send an invite/request to a user (payload includes senderId, receiverId, roomId optional).
- `joinRoom` (roomId, userId) — join a specific room.
- `createRoom` (roomName, roomData) — create room with metadata (adminId, isPrivate, showSenderId, allowSaveChat, allowAddPeople).
- `joinRandomRoom` (userId) — join a random public room.
- `leaveRoom` (roomName)
- `giveListOfRooms` — request public rooms list.
- `updateRoomData` (roomId, roomData) — update room settings.
- `checkRoom` — used in some flows to verify room existence before joining (payload shape varies in code).
- `register` / `setUsername` — register user socket session (some code uses `register`, other uses `setUsername`).

Server emits (client listens in `SocketListner.jsx` and components):
- `connect` / `disconnect` — socket lifecycle.
- `checkIdResult` — returns `{ username, isAvailable }`.
- `message` — room message broadcasted to client. Payload example (used by SocketListner):
  ```js
  {
    id: <msg-id>,
    msg: <text>,
    sender: <senderId>,
    roomId: <roomId>,
    timestamp: <ts>
  }
  ```
- `request` — server notifies receiver about an incoming chat request (payload: senderId, roomId)
- `roomJoined` or `roomCreated` — sent when a room is joined/created, payload includes roomId and room data (roomData, participants)
- `participants` — list of participants for the current room
- `ListOfRooms` — list/array of public rooms for DiscoverRooms UI
- `joinRoomFailed` — error while joining a room

Notes:
- The project contains a few different naming conventions across files — e.g., `sendMessage` vs `message`, `joinRoom` vs `'join'`. If you implement a backend, support the events used by `SocketListner.jsx` and `SocketServices.js` (the centralized listener + services are the main integration points).

---

## REST endpoints expected by the frontend
`src/Utils/Handlers.jsx` calls these endpoints (base `http://localhost:5050`):
- `POST /login` — payload { username, password } -> response should contain `res.data.login` and `res.data.userData` (including username) when successful.
- `POST /signup` — payload { username, password, sessionid } -> response shape used to redirect to /login when `res.login` true.
- `POST /id` — called by `SaveSessionid_handler` with { sessionid }.

Implement these endpoints to integrate with auth storage / DB. For development, you may mock them or use a simple Express+in-memory store.

---

## Component responsibilities (concise)
- `Home.jsx` — orchestrates the logged-in chat view. Uses Zustand stores to read messages, rooms, participants, and to call socket service helpers (AcceptRequest_S, sendMessage_S, leaveRoom_S).
- `SocketManager` (`Utils/SocketListner.jsx`) — single place to connect socket and wire incoming events to Zustand stores.
- `SocketServices.js` — exports `socket` instance (autoConnect: false) and convenience functions to emit socket events from components.
- `Search.jsx` — UI to search user IDs and send an invite request.
- `SavedRooms.jsx` — lists rooms persisted in `Rooms_G`, supports join/delete.
- `CreateRoom.jsx` — modal to create new room; emits createRoom socket event via `CreateRoom_S`.

---

## Styling
- Simple component-level CSS files live next to components (`.css` per component).
- Global variables in `index.css` include `--background-color`.
- Animations used for collapsible panels, modal overlays, and the incoming request banner.

---

## Notes about inconsistencies & what to watch for
- Some socket event names are duplicated or inconsistent in the codebase (e.g., `sendMessage` vs `message` vs `message` with different payload format). The authoritative handlers are in `SocketListner.jsx` and the helpers in `SocketServices.js` — implement server events to satisfy those two files first.
- The frontend assumes a rich server: room lifecycle (create/join/leave), persistent room lists, participant lists, and the ability to send join requests. Implementing these on the server is the quickest way to get full functionality.
- There are multiple places where both `myId` and `userName` are used; sessions and IDs are different concerns (socket id vs username). Use consistent identity in your backend (assign usernames to sockets at registration).

---

## Minimal backend contract suggestion (example)
- Socket.IO server listening at port `5050`.
- REST endpoints for login/signup as above.
- Socket events supported by server (recommended minimal set):
  - `connect`, `disconnect`
  - `setUsername` or `register` (payload { username, metadata }) — maps socket.id <-> username
  - `checkId` -> emit `checkIdResult` ({ username, isAvailable })
  - `createRoom` -> create room, emit `roomCreated` to creator
  - `joinRoom` -> join user to room, emit `roomJoined` and emit `participants` to the room
  - `sendMessage` -> server should broadcast to room: `message` with payload { id, msg, sender, roomId, timestamp }
  - `sendRequest` -> server emits `request` to the target user socket
  - `giveListOfRooms` -> server emits `ListOfRooms` with array of rooms

---

## Recommended next steps / TODOs
- Implement a backend server that satisfies the socket + REST contract.
- Consolidate event naming to a canonical set to reduce confusion (use the wrappers in `SocketServices.js` and `SocketListner.jsx` as canonical names).
- Add TypeScript or PropTypes for improved developer ergonomics.
- Add unit / integration tests for key flows (auth, room create/join, messaging).
- Add more user-friendly UI states (loading indicators, error messages, send confirmation, timestamps formatting in messages across components).

---

## Where to look in the code for common tasks
- Add a new socket handler: `src/Utils/SocketListner.jsx`.
- Emit a socket event from a component: use `src/Utils/SocketServices.js` helper or call `socket.emit()` (preferred to use helper).
- Read/write chat messages: `src/Utils/Store.jsx` (`Messages_G` store).

---

If you want, I can:
- Generate a small Express + Socket.IO server implementation that matches the frontend contract (REST + socket events) so you can run end-to-end locally.
- Consolidate socket event names and refactor the frontend to use a single payload format.
- Add more detailed diagrams (sequence diagrams) showing message flows between clients and server.

Which follow-up would you like me to do next? (I can scaffold the backend server automatically.)
