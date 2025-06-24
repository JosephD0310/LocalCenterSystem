import {
    faChevronCircleLeft,
    faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

export default function Carousel({
    autoSlide = false,
    autoSlideInterval = 3000,
    slides,
}: {
    autoSlide?: boolean;
    autoSlideInterval?: number;
    slides: React.ReactNode[];
}) {
    const visibleSlides = 3;
    const [curr, setCurr] = useState(0);

    const maxIndex = Math.max(0, slides.length - visibleSlides);

    const prev = () => setCurr((curr) => (curr === 0 ? maxIndex : curr - 1));
    const next = () => setCurr((curr) => (curr === maxIndex ? 0 : curr + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="overflow-hidden relative px-10 pb-10 pt-5">
            <div
                className="flex transition-transform ease-out duration-500"
                style={{
                    width: `${(slides.length / visibleSlides) * 100}%`,
                    transform: `translateX(-${(curr * 100) / slides.length}%)`,
                }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="w-1/3 flex-shrink-0 px-5">
                        {slide}
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-between">
                <button onClick={prev} className="cursor-pointer">
                    <FontAwesomeIcon icon={faChevronCircleLeft} size="xl" color="#85CC16" />
                </button>
                <button onClick={next} className="cursor-pointer">
                    <FontAwesomeIcon icon={faChevronCircleRight} size="xl" color="#85CC16" />
                </button>
            </div>

            <div className="absolute bottom-0 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <div
                            key={i}
                            className={`
              transition-all w-3 h-3 bg-[#85CC16] rounded-full
              ${curr === i ? 'p-2' : 'bg-opacity-50'}
            `}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
