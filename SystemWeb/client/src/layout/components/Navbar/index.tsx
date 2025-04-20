import { NavLink } from 'react-router-dom';
import config from '../../../config';

function Navbar() {
    return (
        <div className='flex flex-row justify-center'>
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
                        to={config.routes.devices}
                        className={({ isActive }) =>
                            isActive ? 'bg-[#85CC16] px-6 py-3 rounded-[20px]' : 'bg-transparent px-6 py-3'
                        }
                    >
                        Devices
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;
