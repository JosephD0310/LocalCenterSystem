import { SVGProps } from 'react';

function BgBox(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1400"
            height="711"
            viewBox="0 0 1400 711"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            {...props}
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 60C0 26.8629 26.8629 0 60 0H279.851C289.156 0 298.333 2.16407 306.658 6.32119L381.465 43.6788C389.79 47.8359 398.967 50 408.272 50H700H701H992.728C1002.03 50 1011.21 47.8359 1019.53 43.6788L1094.34 6.32119C1102.67 2.16407 1111.84 0 1121.15 0H1340C1373.14 0 1400 26.8629 1400 60V651C1400 684.137 1373.14 711 1340 711H60C26.8629 711 0 684.137 0 651V60Z"
                fill="#F5F5F5"
            />
        </svg>
    );
}

export default BgBox;
