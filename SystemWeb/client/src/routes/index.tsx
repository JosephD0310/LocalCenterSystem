import { ComponentType } from "react";
import config from "../config";
import Home from "../pages/Home";
import Management from "../pages/Devices";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";

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
        path: config.routes.devices, component: Management, layout: DefaultLayout,
        isPrivate: true
    }
]

export {publicRoutes}