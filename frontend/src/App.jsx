
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import { setSocketConnected, setSocketId } from './redux/socketSlice';
import socketService from './services/socketService';
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './components/ui/Login';
import Signup from './components/ui/Signup';
import MainLayout from './components/ui/MainLayout';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import Home from './components/ui/Home';
import Profile from './components/ui/Profile';
import './App.css';

// Error boundary for Redux errors
class ReduxErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Redux Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-4">
                            There was an error with the application state. Please refresh the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    useEffect(() => {
        // Initialize socket connection
        const socket = socketService.connect();
        
        socket.on('connect', () => {
            console.log('Connected to server');
            store.dispatch(setSocketConnected(true));
            store.dispatch(setSocketId(socket.id));
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            store.dispatch(setSocketConnected(false));
            store.dispatch(setSocketId(null));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ReduxErrorBoundary>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/" element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
                                <Route index element={<Home />} />
                                <Route path="profile/:id" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
                                <Route path="account/edit" element={<ProtectedRoutes><EditProfile /></ProtectedRoutes>} />
                                <Route path="chat" element={<ProtectedRoutes><ChatPage /></ProtectedRoutes>} />
                            </Route>
                        </Routes>
                    </Router>
                </ReduxErrorBoundary>
            </PersistGate>
        </Provider>
    );
}

export default App;
