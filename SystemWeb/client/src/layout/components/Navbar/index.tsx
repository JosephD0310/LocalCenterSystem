import { NavLink } from 'react-router-dom';
import config from '../../../config';
import { ComponentProps } from 'react';

function Navbar(props: ComponentProps<any>) {
    return (
        <div {...props}>
            <ul className="flex flex-row gap-10 font-bold text-white">
                <li>
                    <NavLink
                        to={config.routes.home}
                        className={({ isActive }) =>
                            isActive ? 'bg-[#85CC16] px-6 py-3 rounded-[20px]' : 'bg-transparent px-6 py-3'
                        }
                    >
                        Overview
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={config.routes.management}
                        className={({ isActive }) =>
                            isActive ? 'bg-[#85CC16] px-6 py-3 rounded-[20px]' : 'bg-transparent px-6 py-3'
                        }
                    >
                        Management
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;
