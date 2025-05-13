import useSocket from "../../../services/hooks/useSocket";

type RestartProps = {
    serialNumber: string
}
function Restart({serialNumber} : RestartProps) {
    const { controlReq } = useSocket();

    const handleRestart = () => {
        const payload = {
            serialNumber: serialNumber,
            control: {
                action: 'Restart',
            },
        };
        controlReq(payload);
    };
    
    return (
        <div className="flex flex-row justify-between items-center">
            <span>Are you sure you want to restart this device?</span>
            <div className="flex flex-row gap-5">
            <button
                    className="bg-[#85CC16] p-5 text-white shadow-xs rounded-2xl cursor-pointer hover:bg-[#78BF18] font-semibold"
                    onClick={handleRestart}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default Restart;
