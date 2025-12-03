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

export function registerUser(username,data){
  if(username && socket.connected){
    socket.emit("setUsername", username,data);
  }
}

export function updateUser(username,data){
  if(username && socket.connected){
    socket.emit("updateUser", username,data);
  }
}

export function sendMessage_S(data){
  if(socket.connected){
    socket.emit("sendMessage", data);
  }
}

export function AcceptRequest_S(roomId, userId){
  if(socket.connected){
    socket.emit("joinRoom", roomId, userId);
  }
}

export function JoinRoom_S(roomId, userId){
  if(socket.connected){
    socket.emit("joinRoom", roomId, userId);
  }
}

export function JoinRandomRoom_S(userId){
  if(socket.connected){
    socket.emit("joinRandomRoom", userId);
  }
}

export const handleSendRequest = (sender, receiver, roomId) => {
  if (socket.connected) {
    socket.emit("sendRequest", {
      senderId: sender,
      receiverId: receiver,
      roomId:roomId
    });
  } else {
    console.warn("Socket not connected, cannot send request.");
  }
};

export function CreateRoom_S(roomName, roomData){
  if(socket.connected){
    socket.emit("createRoom", roomName, roomData);
  }
}

export function leaveRoom_S(roomName){
  if(socket.connected){
    socket.emit("leaveRoom", roomName);
  }
}

export function triggerGetRooms_S(){
  if(socket.connected){
    socket.emit("giveListOfRooms");
  }
}

export function updateRoomData_S(roomId, roomData){
  if(socket.connected){
    socket.emit("updateRoomData", roomId, roomData);
  }
}