import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // địa chỉ backend

function useSocket() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        socket.on('mqtt-data', (mqttData) => {
            console.log(mqttData);
            setData(mqttData);
        });

        return () => {
            socket.off('mqtt-data');
        };
    }, []);

    return data;
}

export default useSocket;
