import { createSlice } from "@reduxjs/toolkit";
import { sanitizeForRedux, findNonSerializableValue } from "../utils/reduxDebug.js";

// Helper function to ensure message is serializable
const serializeMessage = (message) => {
    if (!message) return null;
    
    try {
        // Check if message contains non-serializable data
        const nonSerializable = findNonSerializableValue(message);
        if (nonSerializable) {
            console.warn('Non-serializable data in message:', nonSerializable);
        }
        
        const serialized = {
            _id: message._id?.toString() || message._id,
            senderId: message.senderId?.toString() || message.senderId,
            receiverId: message.receiverId?.toString() || message.receiverId,
            message: message.message,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        };
        
        // Sanitize the entire object
        return sanitizeForRedux(serialized);
    } catch (error) {
        console.error('Error serializing message:', error);
        return null;
    }
};

// Helper function to serialize messages array
const serializeMessages = (messages) => {
    if (!Array.isArray(messages)) return [];
    try {
        return messages.map(serializeMessage).filter(Boolean);
    } catch (error) {
        console.error('Error serializing messages array:', error);
        return [];
    }
};

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: {},  // Store messages per user (object where keys are user IDs)
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload || [];
        },
        setMessages: (state, action) => {
            try {
                const { userId, messages } = action.payload;
                if (userId && messages) {
                    state.messages[userId] = serializeMessages(messages);
                }
            } catch (error) {
                console.error('Error in setMessages:', error);
                // Don't update state if there's an error
            }
        },
        addMessage: (state, action) => {
            try {
                const { userId, message } = action.payload;
                if (!userId || !message) return;
                
                if (!state.messages[userId]) {
                    state.messages[userId] = [];
                }
                
                const serializedMessage = serializeMessage(message);
                if (serializedMessage) {
                    state.messages[userId].push(serializedMessage);
                }
            } catch (error) {
                console.error('Error in addMessage:', error);
                // Don't update state if there's an error
            }
        },
        clearMessages: (state, action) => {
            const userId = action.payload;
            if (userId) {
                delete state.messages[userId];
            }
        },
        clearAllMessages: (state) => {
            state.messages = {};
        }
    }
});

export const { setOnlineUsers, setMessages, addMessage, clearMessages, clearAllMessages } = chatSlice.actions;
export default chatSlice.reducer;
