import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UserName_G = create((set) => ({
  userName: '',
  setUserName: (value) => {
    set(() => ({ userName: value }))
  }
}));

export const UserId_G = create((set) => ({
  userId: '',
  setuserId: (value) => {
    set(() => ({ userId: value }))
  }
}));

export const JoinedRoomId_G = create((set) => ({
  joinedRoomId: '',
  setjoinedRoomId: (value) => {
    set(() => ({ joinedRoomId: value }))
  }
}));

export const SearchId_result_G = create((set) => ({
  id: '',
  available: false,
  setId: (value) => {
    set((state) => ({ ...state, id: value }))
  },
  setAvailable: (value) => {
    set((state) => ({ ...state, available: value }))
  }
}));

export const Received_Request_Data_G = create((set) => ({
  requestId_G: '',
  roomId_G: '',
  setRequestId: (senderId, roomId) => {
    set(() => ({ requestId_G: senderId, roomId_G: roomId }))
  },
}));

export const ServerConnected_G = create((set) => ({
  isConnected: false,
  setIsConnected: (value) => {
    set(() => ({ isConnected: value }))
  }
}));

export const Messages_G = create(
  persist(
    (set) => ({
      messages: {},
      //message format
      //   {
      //   id: '',
      //   text: "Hello everyone!",
      //   senderId: "user123",
      //   timestamp: '',
      // };

      addMessage: (roomId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), message],
          },
        })),

      setMessages: (roomId, newMessages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: newMessages,
          },
        }),true),

      clearMessages: (roomId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [],
          },
        })),
    })));

export const IsLogedIn_G = create((set) => ({
  islogedin: false,
  setislogedin: (value) => {
    set(() => ({ islogedin: value }))
  }
}));

export const Participants_G = create((set) => ({
  participants: {},

  addParticipant: (roomId, participantsList) =>
    set((state) => ({
      participants: {
        ...state.participants,
        [roomId]: participantsList,
      },
    })),

  delParticipant: (roomId) =>
    set((state) => {
      const updated = { ...state.participants };
      delete updated[roomId];
      return { participants: updated };
    }),
}));

export const Chats_G = create((set) => ({
  chats: [],

  addChat: (value) =>
    set((state) => ({
      chats: [...state.chats, value],
    })),

  removeChat: (value) =>
    set((state) => ({
      chats: state.chats.filter((c) => c !== value),
    })),
}));

export const ProfileBtns_G = create(persist((set) => ({
  Private: false,
  Invite: false,
  SaveChat: false,
  togglePrivate: () => { 
    set((state) => ({ ...state, Private: !state.Private }))
  },
  toggleInvite: () => {
    set((state) => ({ ...state, Invite: !state.Invite }))
  },
  toggleSave: () => {
    set((state) => ({ ...state, SaveChat: !state.SaveChat }))
  }
}))
);

export const ActionBtns_G = create((set) => ({
  createRoom: false,
  discoverRooms: false,
  randomRooms: false,
  toggleCreateRoom: () => {
    set((state) => ({ ...state, createRoom: !state.createRoom }))
  },
  toggleDiscoverRooms: () => {
    set((state) => ({ ...state, discoverRooms: !state.discoverRooms }))
  },
  toggleRandomRooms: () => {
    set((state) => ({ ...state, randomRooms: !state.randomRooms }))
  }
})
);

export const Rooms_G = create(
  persist(
    (set) => ({
      rooms: {},

      addRoom: (roomId, roomData) =>
        set((state) => ({
          rooms: {
            ...state.rooms,
            [roomId]: roomData,
          },
        })),

      delRoom: (roomId) =>
        set((state) => {
          const updated = { ...state.rooms };
          delete updated[roomId];
          return { rooms: updated };
        }),

      updateRoom: (roomId, roomData) =>
        set((state) => ({
          rooms: {
            ...state.rooms,
            [roomId]: roomData,
          },
        })),
    }),

    // {
    //   name: "rooms-store",
    // }
  )
);

export const DiscoverRoomsList_G = create((set) => ({
  listOfRooms: [],  // now an array

  updateDiscoverRoomsList: (value) =>
    set(() => ({
      listOfRooms: value,  // value should now be an array
    })),
}));
