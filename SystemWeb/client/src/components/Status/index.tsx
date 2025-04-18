import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StatusProps = {
    content: 'healthy' | 'unhealthy' | 'offline';
};

function Status({ content }: StatusProps) {

    return (
        <div className="flex flex-row items-center gap-2">
            {content == "healthy" && <FontAwesomeIcon icon={faCircle} className="text-sm" color="#1ED760"/>}
            {content == "unhealthy" && <FontAwesomeIcon icon={faCircle} className="text-sm" color="#F7CA4C"/>}
            {content == "offline" && <FontAwesomeIcon icon={faCircle} className="text-sm" color="#D4DBE6"/>}
            <div
                className={`flex flex-row justify-center rounded-full text-xl font-bold text-gray-700`}
            >
                {content.toUpperCase()}
            </div>
        </div>
    );
}

export default Status;
