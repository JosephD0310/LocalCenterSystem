import { faBell, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Transition } from '@headlessui/react';
import { useState } from 'react';
import Alert from '../Alert';

function SideBar() {
    let [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col items-end gap-4 relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer px-4 py-3 rounded-3xl text-4xl font-medium bg-[#85CC16] text-white focus:outline-none hover:bg-[#78B814]"
            >
                <FontAwesomeIcon icon={faBell} />
            </Button>

            <Transition
                show={isOpen}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition duration-200 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="rounded-xl bg-[#DFEDC8]">
                    <div className="flex-1 bg-white rounded-2xl shadow-xs p-7">
                        <div className="text-3xl font-bold mb-5 border-b-3 pb-5 border-[#85CC16] flex items-center justify-between">
                            <h2>Recent Warning</h2>
                            <FontAwesomeIcon
                                onClick={() => setIsOpen(!isOpen)}
                                icon={faXmark}
                                className="cursor-pointer px-2 py-1 rounded-4xl hover:bg-gray-100"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Alert content="No warnings in the last 24 hours" type="error" object="B1-401" />
                            <Alert content="No warnings in the last 24 hours" type="error" object="B1-401" />
                            <Alert content="No warnings in the last 24 hours" type="error" object="B1-401" />
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
}

export default SideBar;
