import { useEffect } from 'react';
import { registerUser, socket } from './SocketServices';
import { ServerConnected_G, SearchId_result_G, Received_Request_Data_G, UserName_G, Messages_G, JoinedRoomId_G, Participants_G, Rooms_G, DiscoverRoomsList_G, ProfileBtns_G } from './Store';

export function SocketManager() {
    const setIsConnected = ServerConnected_G((state) => state.setIsConnected);
    const setAvailable = SearchId_result_G((state) => state.setAvailable);
    const setId = SearchId_result_G((state) => state.setId);
    const setRequestId = Received_Request_Data_G((state) => state.setRequestId);
    const userName = UserName_G((state) => state.userName);
    const { messages, addMessage, setMessages, clearMessages } = Messages_G((state) => state);
    const { joinedRoomId, setjoinedRoomId } = JoinedRoomId_G((state) => state);
    const addParticipant = Participants_G((state) => state.addParticipant);
    const updateDiscoverRoomsList = DiscoverRoomsList_G((state) => state.updateDiscoverRoomsList);
    const addRoom = Rooms_G((state) => state.addRoom);
    const {Private, Invite, SaveChat, togglePrivate, toggleInvite, toggleSave} = ProfileBtns_G();

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to server.');
            setIsConnected(true);
            registerUser(userName,{private:Private,invite:Invite,savechat:SaveChat});
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on('checkIdResult', (data) => {
            setId(data.username);
            setAvailable(data.isAvailable);
        });

        socket.on('message', (messageData) => {
            addMessage(messageData.roomId, {
                id: messageData.id,
                text: messageData.msg,
                senderId: messageData.sender,
                timestamp: messageData.timestamp,
            });
        });

        socket.on('request', (senderId, roomId) => {
            const invite_ = ProfileBtns_G.getState().Invite;
            if(!invite_){
                setRequestId(senderId, roomId);
            }
        });

        socket.on('roomJoined', (data) => {
            setjoinedRoomId(data['roomId']);
            addRoom(data['roomId'], data);
        });

        socket.on('participants', (participantsList) => {
            const currentRoomId = JoinedRoomId_G.getState().joinedRoomId;
            addParticipant(currentRoomId, participantsList);
        });

        socket.on('roomCreated', (data) => {
            setjoinedRoomId(data['roomId']);
            addParticipant(data['roomId'], data['participants']);
            addRoom(data['roomId'], data);
        });

        socket.on('ListOfRooms', (rooms) => {
            updateDiscoverRoomsList(rooms);
        });
        
        socket.on('joinRoomFailed', (msg) => {
            console.warn("Room join msg:", msg);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('checkIdResult');
            socket.off('request');
            socket.off('message');
            socket.off('roomCreated');
            socket.disconnect();
        };
    }, [setId, setAvailable]);

    return null;
}