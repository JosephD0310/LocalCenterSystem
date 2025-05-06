import { ComponentType } from "react";
import config from "../config";
import Home from "../pages/Home";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";
import Devices from "../pages/Devices";
import DeviceDetail from "../pages/DeviceDetail";

interface IRoute {
    path: string;
    component: ComponentType<any>;
    layout?: ComponentType<any>;
    isPrivate: boolean;
}

const publicRoutes : IRoute[] = [
    {
        path: config.routes.home, component: Home, layout: DefaultLayout,
        isPrivate: true
    },
    {
        path: config.routes.login, component: Login,
        isPrivate: false
    },
    {
        path: config.routes.devices, component: Devices, layout: DefaultLayout,
        isPrivate: true
    },
    {
        path: config.routes.deviceDetail, component: DeviceDetail, layout: DefaultLayout,
        isPrivate: true
    }
]

export {publicRoutes}