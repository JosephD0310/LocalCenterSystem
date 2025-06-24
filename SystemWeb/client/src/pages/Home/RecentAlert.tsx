type Alert = {
    room: string;
    deviceName: string;
    message: string;
    time: string;
};

type Props = {
    alerts: Alert[];
};

function RecentAlert({ alerts }: Props) {
    return (
        <div className="overflow-x-auto">
            {alerts.length == 0 ? (
                <div className="text-center text-gray-500 text-2xl pt-10">
                    <p>No recent alerts</p>{' '}
                </div>
            ) : (
                <table className="w-full bg-white text-2xl text-left text-gray-700">
                    <thead className="bg-[#DFEDC8] text-xl uppercase">
                        <tr>
                            <th className="px-6 py-4">Room</th>
                            <th className="px-6 py-4">Device</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.room} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className="font-bold bg-[#85CC16] text-white px-3 rounded-md">
                                        {alert.room}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{alert.deviceName}</td>
                                <td className="px-6 py-4">{alert.message}</td>
                                <td className="px-6 py-4">{alert.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default RecentAlert;
