import { faBuilding, faHouseUser, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Switch } from '@headlessui/react';

function Firewall() {
    const [domainEnabled, setdomainEnabled] = useState(false);
    const [publicEnabled, setpublicEnabled] = useState(false);
    const [privateEnabled, setprivateEnabled] = useState(false);
    return (
        <div>
            <h2 className="font-bold text-4xl text-[#78BF18] mb-5">Firewall & Network protection</h2>
            <div className="flex flex-row px-10 py-5 gap-10">
                <div className="flex flex-row justify-between items-center w-full bg-white rounded-2xl shadow px-7 py-5">
                    <div className="border-gray-400">
                        <h2 className="text-3xl font-bold mb-3 text-[#0078D7]">
                            <FontAwesomeIcon icon={faBuilding} /> Domain Network
                        </h2>
                        <h2 className="text-2xl text-gray-600">Firewall is on</h2>
                    </div>
                    <Switch
                        checked={domainEnabled}
                        onChange={setdomainEnabled}
                        className="group inline-flex h-9 w-18 items-center rounded-full bg-gray-200 transition data-checked:bg-[#0078D7]"
                    >
                        <span className="size-7 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-10" />
                    </Switch>
                </div>
                <div className="flex flex-row justify-between items-center w-full bg-white rounded-2xl shadow px-7 py-5">
                    <div className="border-gray-400">
                        <h2 className="text-3xl font-bold mb-3 text-[#0078D7]">
                            <FontAwesomeIcon icon={faHouseUser} /> Private Network
                        </h2>
                        <h2 className="text-2xl text-gray-600">Firewall is on</h2>
                    </div>
                    <Switch
                        checked={publicEnabled}
                        onChange={setpublicEnabled}
                        className="group inline-flex h-9 w-18 items-center rounded-full bg-gray-200 transition data-checked:bg-[#0078D7]"
                    >
                        <span className="size-7 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-10" />
                    </Switch>
                </div>
                <div className="flex flex-row justify-between items-center w-full bg-white rounded-2xl shadow px-7 py-5">
                    <div className="border-gray-400">
                        <h2 className="text-3xl font-bold mb-3 text-[#0078D7]">
                            <FontAwesomeIcon icon={faMugHot} /> Public Network
                        </h2>
                        <h2 className="text-2xl text-gray-600">Firewall is on</h2>
                    </div>
                    <Switch
                        checked={privateEnabled}
                        onChange={setprivateEnabled}
                        className="group inline-flex h-9 w-18 items-center rounded-full bg-gray-200 transition data-checked:bg-[#0078D7]"
                    >
                        <span className="size-7 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-10" />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default Firewall;
