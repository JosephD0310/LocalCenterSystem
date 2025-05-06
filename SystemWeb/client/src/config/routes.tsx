const routes = {
    home: '/',
    login: '/login',
    devices: '/devices',
    deviceDetail: '/devices/:id',
    generateDeviceDetail: (id: number ) => `/devices/${id}`,
}

export default routes