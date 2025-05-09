import { faBuilding, faHouseUser, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import useSocket from '../../../services/hooks/useSocket';
import { DeviceData } from '../../../types/devicedata';

type FirewallProps = {
    item: DeviceData;
};

function Firewall({ item }: FirewallProps) {
    const [device, setDevice] = useState<DeviceData>(item);
    const [domainEnabled, setDomainEnabled] = useState(device.firewalls[0].Enabled);
    const [privateEnabled, setPrivateEnabled] = useState(device.firewalls[1].Enabled);
    const [publicEnabled, setPublicEnabled] = useState(device.firewalls[2].Enabled);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const { data, controlReq, response } = useSocket();

    useEffect(() => {
        if (data && data.serialNumber === device.serialNumber) {
            setDevice(data);
            setDomainEnabled(data.firewalls[0].Enabled);
            setPrivateEnabled(data.firewalls[1].Enabled);
            setPublicEnabled(data.firewalls[2].Enabled);
        }
    }, [data]);

    useEffect(() => {
        if (response && response.serial === device.serialNumber) {
            const { action, result } = response.response;
            const bool = result.trim().toLowerCase() === 'true';
            if (action === 'SettingDomain') setDomainEnabled(bool);
            if (action === 'SettingPrivate') setPrivateEnabled(bool);
            if (action === 'SettingPublic') setPublicEnabled(bool);
            setLoadingAction(null);
        }
    }, [response]);

    const handleToggle = (type: 'Domain' | 'Private' | 'Public', current: boolean) => {
        const payload = {
            serialNumber: device.serialNumber,
            control: {
                action: `Setting${type}`,
                param: !current,
            },
        };
        setLoadingAction(`Setting${type}`);
        controlReq(payload);
    };

    const renderSwitch = (
        label: string,
        icon: any,
        type: 'Domain' | 'Private' | 'Public',
        enabled: boolean
    ) => {
        const action = `Setting${type}`;
        const isLoading = loadingAction === action;

        return (
            <div className="flex flex-row justify-between items-center w-full bg-white rounded-2xl shadow px-7 py-5">
                <div>
                    <h2 className="text-3xl font-bold mb-3 text-[#0078D7]">
                        <FontAwesomeIcon icon={icon} /> {label}
                    </h2>
                    <h2 className="text-2xl text-gray-600">Firewall is {enabled ? 'on' : 'off'}</h2>
                    {isLoading && <p className="text-sm text-gray-400">Processing...</p>}
                </div>
                <Switch
                    checked={enabled}
                    onChange={() => handleToggle(type, enabled)}
                    className={`group inline-flex h-9 w-18 items-center rounded-full transition ${
                        isLoading
                            ? 'bg-gray-300 cursor-not-allowed opacity-50'
                            : 'bg-gray-200 data-checked:bg-[#0078D7] cursor-pointer'
                    }`}
                    disabled={loadingAction !== null}
                >
                    <span className="size-7 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-10" />
                </Switch>
            </div>
        );
    };

    return (
        <div>
            <h2 className="font-bold text-4xl text-[#78BF18] mb-5">Firewall & Network protection</h2>
            <div className="flex flex-row px-10 py-5 gap-10">
                {renderSwitch('Domain Network', faBuilding, 'Domain', domainEnabled)}
                {renderSwitch('Private Network', faHouseUser, 'Private', privateEnabled)}
                {renderSwitch('Public Network', faMugHot, 'Public', publicEnabled)}
            </div>
        </div>
    );
}

export default Firewall;
