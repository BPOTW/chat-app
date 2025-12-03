
# Chat App (React + Vite)

This repository contains a client-side chat application built with React and Vite. It provides a lightweight UI, client-side state management with Zustand, and real-time communication using Socket.IO. The frontend assumes a Socket.IO backend (not fully included) and a small REST API for auth.

This README summarizes features, how to run the frontend, the backend contract the frontend expects, important implementation notes, and where to find key code.

---


# Chat App — UI / UX Overview (Autonomous & Anonymous)

This project is an autonomous, privacy-minded chat client built with React and Vite. It focuses on lightweight, hands-off chat experiences where users can discover public rooms, create private rooms, join random conversations, and control privacy settings without sharing personal information.

This README highlights the user-facing features and the UX flows you’ll find in the app — not implementation details.

---

## Key UI / UX Features

- Discover Rooms
	- Browse a curated list of public rooms in a modal.
	- Each room shows a short summary (room id, number of members).
	- Join any public room quickly via the Discover modal — no profile exposure required.

- Create Rooms (Quick, Customizable)
	- Create a room with a name and simple settings: make it private, show/hide sender IDs, allow chat saving, allow adding people.
	- Private rooms are hidden from Discover and can only be joined via invite or direct request.
	- The create-room modal is compact and uses progressive disclosure (only relevant toggles are shown).

- Join Random Room (Fast Match)
	- One-click random room join to meet new people immediately.
	- Useful for low-friction conversations and for testing anonymity flows.

- Invite / Request System
	- Search for a user ID and send a join request instead of exposing a public link.
	- Recipients see a small animated request popup with simple Accept / Cancel actions.
	- The request UX is unobtrusive and animated for clarity without interrupting the conversation.

- Saved Rooms
	- Save frequently-used rooms locally for quick access.
	- Delete saved rooms or re-join them with one click.

- Chat UI
	- Clean, focused two-column layout: settings/controls on the left, chat area on the right.
	- Per-room message lists with auto-scroll, compact bubbles, and option to show sender IDs.
	- Input supports Enter-to-send and has a visually prominent Send button.

- Participants & Admin Controls
	- View room participants and member counts in the side panel.
	- Room admins see extra controls: toggling privacy, allowing saves, permitting others to add people.

- Accessibility & Responsiveness
	- Keyboard-friendly inputs (Enter to send, accessible inputs for search and room creation).
	- Responsive layout keeps controls usable on narrow screens.

---

## Privacy & Anonymity (Design Principles)

This app is designed as an autonomous, anonymous chat experience. The UI/UX choices reflect that: simple controls, minimal identity exposure, and optional persistence.

- Minimal Identity Surface
	- Users can interact primarily via ephemeral room IDs and lightweight user IDs; sharing email or phone is not required.
	- Sender display is optional (room setting). When disabled, messages are anonymous within the room.

- Private Rooms & Invite-Only Access
	- Private rooms do not appear in Discover and are joinable only by direct invite/room code or request acceptance.
	- Hosts can control who joins via a request/accept workflow, preserving autonomy.

- Ephemeral / Persistent Options
	- Rooms can be configured to allow or disallow saving chat history. If saving is disabled, messages are not persisted client-side for that room.
	- Saved rooms are stored client-side only (local state) and can be removed any time.

- Request Blocking & Controls
	- Users can toggle blocking of incoming requests (block requests setting) to avoid uninvited contact.
	- Animated request popups are compact and dismissable instantly.

- Local-First Data
	- Many controls (saved rooms, some UI toggles) are handled client-side so users retain control over their local experience.

---

## Typical User Flows

- Quick join (public): open Discover → browse rooms → click Join → start chatting.
- Invite-only: create a private room → share room id with a friend → friend sends request → host accepts → chat.
- Anonymous discovery: Join Random Room → instant anonymous chat with strangers → Leave when done (no profile required).

---

## Where to find the UI code

- `src/Components/DiscoverRooms/` — Discover modal and public rooms list.
- `src/Components/CreateRoom/` — Create room modal and settings toggles.
- `src/Components/Funarea/` — Actions panel (Create / Discover / Random).
- `src/Components/Savedrooms/` — Saved rooms UI and delete/join actions.
- `src/Components/Search/` — Search by ID and send request UI.
- `src/Components/ChatSettings/` — Room-level toggles (privacy, save chat, show sender ID, allow add people).
- `src/Components/Participents/` & `src/Components/ChatInfo/` — Participants and room info display.

---

## Quick setup (if you want to run the UI locally)
1. Install dependencies:

```powershell
npm install
```

2. Start dev server:

```powershell
npm run dev
```

3. Note: To enable full real-time features you will need a Socket.IO backend. The UI is intentionally autonomous and will still let you test many flows locally, but room persistence and multi-user chat require a backend.

---

If you want, I can now:
- Scaffold a small demo backend that supports the invite workflow and room settings (Socket.IO + Express).
- Add copy-to-clipboard for room codes and a one-click share UX.
- Improve the request popup with a timeout and sound notification option.

Which of these should I do next?

```powershell
npm run dev
```

3. The frontend expects a Socket.IO server on `http://localhost:5050` and several REST endpoints (see "Backend contract" below). The repository contains utilities (`src/Utils/SocketServices.js` and `src/Utils/SocketListner.jsx`) to connect and wire socket events.

---

## Backend contract (what frontend expects)
Implementing a backend that matches these expectations will make the full app functional. The frontend relies on both Socket.IO events and a few REST endpoints.

REST endpoints (base `http://localhost:5050`):
- `POST /login` — body: { username, password } -> response should include `login: true` and `userData` on success.
- `POST /signup` — body: { username, password, sessionid } -> returns `{ login: true }` when created.
- `POST /id` — optional endpoint used for session id saving.

Socket.IO events (recommended minimal set):
- Client -> Server:
	- `register` or `setUsername` (payload: username, meta)
	- `checkId` (payload: id) — server replies `checkIdResult` with `{ username, isAvailable }`
	- `createRoom` (roomName, roomData) — server responds with `roomCreated`
	- `joinRoom` (roomId, userId) — server responds with `roomJoined` or `joinRoomFailed`
	- `sendMessage` (payload: { roomId, msg, sender, timestamp }) — server broadcasts `message` to the room
	- `sendRequest` (payload: { senderId, receiverId, roomId }) — server emits `request` to the receiver
	- `giveListOfRooms` — server emits `ListOfRooms`
	- `leaveRoom`, `updateRoomData`, `joinRandomRoom` — optional helpers

- Server -> Client:
	- `connect` / `disconnect`
	- `checkIdResult`
	- `message` (payload example: `{ id, msg, sender, roomId, timestamp }`)
	- `request` (senderId, roomId)
	- `roomCreated`, `roomJoined` (with room meta and participants)
	- `participants` (list for a room)
	- `ListOfRooms`

Notes: event names in the frontend vary slightly between files; the most important integration points are `src/Utils/SocketListner.jsx` (listeners) and `src/Utils/SocketServices.js` (emit helpers). Implement server handlers that satisfy those two files first for best compatibility.

---

## Key code locations (where to look)
- Entry & routing: `src/main.jsx`
- Auth & landing redirect: `src/App.jsx`
- Main app view: `src/Home.jsx`
- Socket helpers: `src/Utils/SocketServices.js`
- Central socket listener that maps events to Zustand: `src/Utils/SocketListner.jsx`
- Client stores: `src/Utils/Store.jsx` (Zustand)
- Components: `src/Components/` (each component has its own `.jsx` and `.css`)

---

## Important implementation notes
- Zustand stores are central — `Messages_G`, `Rooms_G`, `Participants_G`, etc. Use those stores to read/update application state instead of prop-drilling.
- Message payloads: the frontend expects `{ id, msg, sender, roomId, timestamp }` in many places — follow that format to keep stores working.
- Identity: the app uses both socket IDs and usernames. The server should map usernames to sockets at registration so events that address a user by username or socket id both work.
- There are a few inconsistencies across files (naming of events and small differences in payload shape). When building the backend prefer the event names used in `SocketListner.jsx` and `SocketServices.js`.

---

## Features & UX details (expanded)
- Search & Invite: search a user ID, see availability, and send a join request. The recipient sees a small animated request popup and can accept/decline.
- Create Room: modal to create rooms with options (private, show sender id, save chat, allow add people).
- Discover Rooms: modal lists public rooms returned by the server; user can join.
- Saved Rooms: user can store rooms client-side (Zustand) and quickly re-join or delete them.
- Chat UI: messages are shown per-room with optional sender display and timestamps; input supports Enter to send.
- Participants panel: shows joined members and count; admin controls are available when you are the room admin.

---

## Development tips
- Run the frontend and backend in separate terminals. Example backend start (if implemented):

```powershell
node server.js
```

- Use `SocketListner.jsx` and `SocketServices.js` as your reference for which events to support. You can add additional events if you extend features, but keep the mappings consistent.
- Consider consolidating event names and payload formats for maintainability (e.g., always use `sendMessage` with `{ roomId, msg, sender, timestamp }`).

