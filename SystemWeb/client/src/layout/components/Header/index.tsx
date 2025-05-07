import { Link } from 'react-router-dom';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Navbar from '../Navbar';
import config from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


function Header() {
    return (
        <div className="w-full h-20 flex flex-row justify-between items-center px-10 mb-5">
            <Link to={config.routes.home} className="flex flex-row gap-5">
                <img src="./logo.svg" alt="" />
                <span className="font-bold text-3xl">SystemCenter</span>
            </Link>
            <Navbar />
            <Popover className="relative">
                <PopoverButton className="cursor-pointer">Admin</PopoverButton>
                <PopoverPanel
                    anchor="bottom end"
                    className="flex flex-col rounded-xl shadow transition duration-200 ease-in-out bg-[#DFEDC8]"
                >
                    <div className="p-3">
                        <Link
                            to={config.routes.login}
                            className="block rounded-lg px-3 py-2 transition hover:text-white hover:bg-[#85CC16]"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className='mr-5'/><span>Logout</span>
                        </Link>
                    </div>
                </PopoverPanel>
            </Popover>
        </div>
    );
}

export default Header;
