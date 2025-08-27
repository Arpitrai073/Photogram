import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"

import postSlice from "./postSlice.js"
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"

import rtnSlice from"./rtnSlice.js"
import { 
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'post', 'chat', 'realTimeNotification'], // Re-enable persistence
    blacklist: ['socketio'], // Don't persist socket state
}

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    realTimeNotification:rtnSlice
   
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['socketio'], // Ignore socket state in serialization checks
                warnAfter: 128,
                // Ignore specific action types that might contain non-serializable data
                ignoredActionPaths: ['payload.socket', 'payload.socketId'],
            },
            immutableCheck: {
                warnAfter: 128,
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

const persistor = persistStore(store);

export { persistor };
export default store;