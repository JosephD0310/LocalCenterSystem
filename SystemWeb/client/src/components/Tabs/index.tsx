import { ReactElement, ReactNode, useState } from 'react';

type TabItemProps = {
    label: string;
    children: ReactNode;
};

export const TabItem: React.FC<TabItemProps> = () => null;

type TabProps = {
    children: ReactElement<TabItemProps>[];
};

function Tabs({ children }: TabProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const tabs = children.map((child) => ({
        label: child.props.label,
        content: child.props.children,
    }));

    return (
        <div>
            <div className="flex space-x-4 mb-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`cursor-pointer py-2 px-4 ${
                            index === activeIndex
                                ? 'border-b-3 border-[#78BF18] text-[#78BF18] font-semibold'
                                : 'text-gray-600 hover:text-[#85CC16]'
                        }`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className='bg-[#DFEDC8] p-10 rounded-xl'>{tabs[activeIndex].content}</div>
        </div>
    );
}

export default Tabs;
