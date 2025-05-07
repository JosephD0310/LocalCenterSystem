import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Shutdown() {
    return (
        <div className='flex flex-row justify-between items-center'>
            <span>Are you sure you want to shut down this device?</span>
            <div className='flex flex-row gap-5'>
                <button onClick={() => null}>
                    <FontAwesomeIcon
                        icon={faCheck}
                        className="bg-[#85CC16] p-5 text-white shadow-xs rounded-2xl cursor-pointer hover:bg-[#78BF18] font-semibold"
                    />
                </button>
                <button onClick={() => null}>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="bg-[#FF6900] p-5 text-white shadow-xs rounded-2xl cursor-pointer hover:bg-[#F06300] font-semibold"
                    />
                </button>
            </div>
        </div>
    );
}

export default Shutdown;
