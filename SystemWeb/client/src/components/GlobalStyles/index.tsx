import { ReactNode } from 'react';
import './GlobalStyles.css'

type Props = {
    children : ReactNode
}

function GlobalStyles({ children } : Props) {
    return children
}

export default GlobalStyles;