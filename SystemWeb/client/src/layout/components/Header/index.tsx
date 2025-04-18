import Navbar from '../Navbar';

function Header() {
    return (
        <div className="w-full h-20 flex flex-row justify-between items-center px-10 mb-5">
            <a href="/" className='flex flex-row gap-5'>
                <img src="./logo.svg" alt="" />
                <span className='font-bold text-3xl'>SystemCenter</span>
            </a>
            <Navbar />
            <div>Admin</div>
        </div>
    );
}

export default Header;
