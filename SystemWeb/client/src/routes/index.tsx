import { ComponentType } from "react";
import config from "../config";
import Home from "../pages/Home";
import Management from "../pages/Devices";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";

interface IRoute {
    path: string;
    component: ComponentType<any>;
    layout?: ComponentType<any>
}

const publicRoutes : IRoute[] = [
    { path: config.routes.home, component: Home, layout: DefaultLayout},
    { path: config.routes.login, component: Login},
    { path: config.routes.devices, component: Management, layout: DefaultLayout}
]

export {publicRoutes}