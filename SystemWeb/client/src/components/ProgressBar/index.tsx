type ProgressBarProps = {
    value: number;
};

function ProgressBar({ value }: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-[#78BF18]" style={{ width: `${value}%` }}></div>
        </div>
    );
}

export default ProgressBar;
