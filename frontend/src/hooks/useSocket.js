import { useSelector } from 'react-redux';
import socketService from '@/services/socketService';

const useSocket = () => {
    const { isConnected, socketId } = useSelector(store => store.socketio);
    
    return {
        socket: socketService.getSocket(),
        isConnected,
        socketId,
        connect: socketService.connect.bind(socketService),
        disconnect: socketService.disconnect.bind(socketService)
    };
};

export default useSocket;
