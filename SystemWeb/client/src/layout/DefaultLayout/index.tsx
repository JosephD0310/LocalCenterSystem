import { ReactNode } from 'react';
import BgBox from '../../components/SvgComponents/BgBox';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

type LayoutProps = {
    children: ReactNode;
};

function DefaultLayout({ children }: LayoutProps) {
    return (
        <div className="relative bg-[#2F3C33] p-5 h-screen">
            <div className="absolute w-[calc(100%-25px)]">
                <Navbar className='flex flex-row justify-center'/>
                <Header />
                {children}
            </div>
            <BgBox className="h-full w-full" />
        </div>
    );
}

export default DefaultLayout;
