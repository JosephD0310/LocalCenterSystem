import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_DEV); 

function useSocket() {
    const [data, setData] = useState<any>(null);
    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        socket.on('mqtt-data', (mqttData) => {
            console.log(mqttData);
            setData(mqttData);
        });

        socket.on('mqtt-response', (controlRes) => {
            console.log(controlRes);
            setResponse(controlRes);
        });

        return () => {
            socket.off('mqtt-data');
            socket.off('mqtt-response');
        };
    }, []);

    const controlReq = (payload: { serialNumber: string; control: { action: string; param?: any } }) => {
        socket.emit('mqtt-control', payload);
    };

    return { data, response, controlReq };
}

export default useSocket;
