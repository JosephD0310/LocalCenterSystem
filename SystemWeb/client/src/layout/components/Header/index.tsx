import { Link } from 'react-router-dom';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Navbar from '../Navbar';
import config from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const email = localStorage.getItem('email');
    const avatarLetter = email ? email[0].toUpperCase() : '?';

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
    return (
        <div className="w-full relative mt-2 h-20">
            <div className="absolute top-0 left-0 right-0 w-max mx-auto">
                <Navbar />
            </div>
            <div className="w-full h-20 flex flex-row justify-between items-center px-20 mb-5">
                <Link to={config.routes.home} className="flex flex-row gap-5 cursor-pointer">
                    <img src="./logofull.svg" alt="" />
                </Link>
                <Popover className="relative">
                    <div className="flex flex-row items-center gap-5 bg-[#DDF1BF] p-2 rounded-full">
                        <p className='cursor-default font-bold ml-5'>{email ? email.replace('@sis.hust.edu.vn', '') : 'User'}</p>
                        <PopoverButton className="cursor-pointer outline-0 w-12 h-12 rounded-full bg-[#85CC16] text-white flex items-center justify-center font-bold hover:bg-[#6DAA14] transition duration-200 ease-in-out">
                            {avatarLetter}
                        </PopoverButton>
                    </div>
                    <PopoverPanel
                        anchor="bottom end"
                        className="mt-5 flex flex-col rounded-md shadow transition duration-200 ease-in-out bg-[#2F3C33] text-white z-20"
                    >
                        <div className="">
                            <h2 className="px-7 py-5 text-2xl font-bold border-b-3 border-[#85CC16] flex items-start gap-5">
                                <FontAwesomeIcon icon={faUser} />{' '}
                                {email ? email.replace('@sis.hust.edu.vn', '') : 'User'}
                            </h2>
                        </div>
                        <div className="py-2">
                            <div
                                onClick={handleLogout}
                                className="block px-10 py-2 transition hover:text-white hover:bg-[#85CC16] cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} className="mr-5" />
                                <span>Logout</span>
                            </div>
                        </div>
                    </PopoverPanel>
                </Popover>
            </div>
        </div>
    );
}

export default Header;
