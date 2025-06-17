import { ReactNode } from 'react';
import BgBox from '../../components/SvgComponents/BgBox';
import Header from '../components/Header';

type LayoutProps = {
    children: ReactNode;
};

function DefaultLayout({ children }: LayoutProps) {
    return (
        <div className="relative bg-[#2F3C33] h-screen overflow-hidden p-4">
            <BgBox className="h-full w-full" />
            <div className="absolute inset-0 p-2 z-10">
                <Header/>
                <div>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
