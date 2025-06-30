import { ComponentType } from "react";
import config from "../config";
import Home from "../pages/Home";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";
import Devices from "../pages/Devices";
import DeviceDetail from "../pages/DeviceDetail";
import Room from "../pages/Room";

interface IRoute {
    path: string;
    component: ComponentType<any>;
    layout?: ComponentType<any>;
}

const publicRoutes : IRoute[] = [
    {
        path: config.routes.login, component: Login,
    }
]

const privateRoutes : IRoute[] = [
    {
        path: config.routes.home, component: Home, layout: DefaultLayout,
    },
    {
        path: config.routes.devices, component: Devices, layout: DefaultLayout,
    },
    {
        path: config.routes.room, component: Room, layout: DefaultLayout,
    },
    {
        path: config.routes.deviceDetail, component: DeviceDetail, layout: DefaultLayout,
    }
]

export {publicRoutes, privateRoutes}