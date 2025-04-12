import { ReactNode } from "react"
import { Link } from "react-router-dom"

type Props = {
    icon? : ReactNode
    children : ReactNode
    to? : string
    onClick? : () => void

}

function Item({ icon, children, to, onClick } : Props) {

    const props = {to, onClick}

    let Comp: React.ElementType = 'div';

    if (to) {
        Comp = Link;
    }

    return ( 
        <Comp className='' {...props}>
            {icon && <span className=''>{icon}</span>}
            <span className=''>{children}</span>
        </Comp>
     );
}
export default Item;