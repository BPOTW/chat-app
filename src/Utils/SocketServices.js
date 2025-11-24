import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5050";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export function searchForId(id) {
  if (socket.connected) {
    socket.emit("checkId", id);
  } else {
    console.warn("Socket not connected, cannot perform search.");
  }
}

export function registerUser(username){
  if(username && socket.connected){
    socket.emit("setUsername", username);
    // socket.emit("join",username);
  }
}

export function sendMessage_S(data){
  if(socket.connected){
    socket.emit("sendMessage", data);
  }
}

export function AcceptRequest_S(roomId, userId){
  if(socket.connected){
    console.log('accept request data', roomId, userId);
    socket.emit("joinRoom", roomId, userId);
  }
}

export function JoinRoom_S(roomId, userId){
  if(socket.connected){
    socket.emit("joinRoom", roomId, userId);
  }
}

export const handleSendRequest = (sender, receiver, roomId) => {
  if (socket.connected) {
    socket.emit("sendRequest", {
      senderId: sender,
      receiverId: receiver,
      roomId:roomId
    });
    // socket.emit("joinRoom", roomId, receiver);
  } else {
    console.warn("Socket not connected, cannot send request.");
  }
};

export function CreateRoom_S(roomName, roomData){
  if(socket.connected){
    socket.emit("createRoom", roomName, roomData);
  }
}