import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import Wrapper from '../../../components/Popper/Wrapper';
import Item from '../../../components/Popper/Item';

function Header() {
    return (
        <div className=''>
            <div className="container mx-auto flex h-full items-center justify-between text-white font-bold">
                <div className="text-white text-5xl font-bold">
                    <span className="text-green-400">E</span>BAI
                </div>
                <div className="flex items-center gap-4 ">
                    {1 ? (
                        <>
                            <p>Admin</p>
                            <Tippy
                                visible
                                // onClickOutside={hideUser}
                                placement="bottom-end"
                                interactive
                                render={(attrs) => (
                                    <div className='' tabIndex={-1} {...attrs}>
                                        <Wrapper>
                                            <Item icon=''>Profile</Item>
                                            <Item
                                                icon=''
                                            >
                                                Log out
                                            </Item>
                                        </Wrapper>
                                    </div>
                                )}
                            >
                                <div className='' >
                                    <img className="h-14" src="/ava.png" alt="avatar" style={{cursor: "pointer"}}/>
                                </div>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <div className="flex">
                                <Link to='' className="text-green-400">
                                    Login
                                </Link>
                                <span className="w-10"></span>
                                <Link to=''>Sign up</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
