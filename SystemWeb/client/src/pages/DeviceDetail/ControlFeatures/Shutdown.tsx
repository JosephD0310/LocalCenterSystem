import useSocket from "../../../services/hooks/useSocket";

type ShutdownProps = {
    serialNumber: string
}
function Shutdown({serialNumber} : ShutdownProps) {
    const { controlReq } = useSocket();

    const handleShutdown = () => {
        const payload = {
            serialNumber: serialNumber,
            control: {
                action: 'Shutdown',
            },
        };
        controlReq(payload);
    };
    
    return (
        <div className="flex flex-row justify-between items-center">
            <span>Are you sure you want to shut down this device?</span>
            <div className="flex flex-row gap-5">
                <button
                    className="bg-[#85CC16] p-5 text-white shadow-xs rounded-2xl cursor-pointer hover:bg-[#78BF18] font-semibold"
                    onClick={handleShutdown}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default Shutdown;
