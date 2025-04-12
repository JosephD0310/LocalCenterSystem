import { ReactNode } from "react";

type Props = {
    children : ReactNode;
}

function Wrapper({ children } : Props) {
    return <div className='bg-white rounded-2xl'>{children}</div>
}

export default Wrapper;