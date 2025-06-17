const routes = {
    home: '/',
    login: '/login',
    devices: '/devices',
    room: '/devices/room/:roomId',
    deviceDetail: '/devices/:id',
    generateDeviceDetail: (id: number ) => `/devices/${id}`,
    generateRoom: (roomId: string ) => `/devices/room/${roomId}`,
}

export default routes