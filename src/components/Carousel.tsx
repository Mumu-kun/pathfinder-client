import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

type CarouselProps = {
	children?: JSX.Element | JSX.Element[];
	autoplay?: boolean;
	loop?: boolean;
	duration?: number;
};

const Carousel: React.FC<CarouselProps> = ({ children, autoplay, loop = false, duration = 50 }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop, align: "start", duration },
		autoplay ? [Autoplay({ delay: 5000 + Math.random() * 500, stopOnMouseEnter: true })] : undefined
	);

	const [showScroll, setShowScroll] = useState<boolean>(false);

	const scrollPrev = useCallback(() => {
		if (emblaApi) {
			emblaApi.scrollPrev();
		}
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) {
			emblaApi.scrollNext();
		}
	}, [emblaApi]);

	useEffect(() => {
		const setScrollable = (emApi: any) => {
			if (!emApi) return;
			setShowScroll(emApi.canScrollNext());
		};

		setScrollable(emblaApi);

		emblaApi?.on("reInit", setScrollable);

		return () => {
			emblaApi?.off("reInit", setScrollable);
		};
	}, [emblaApi]);

	return (
		<div className="relative flex items-center px-6">
			<div ref={emblaRef} className="mt-2 flex-1 overflow-hidden rounded-lg pb-2">
				<div className="flex gap-4">{children}</div>
			</div>

			{showScroll && (
				<FaCircleChevronLeft
					onClick={scrollPrev}
					id="img-prev"
					className="absolute left-0 z-10 cursor-pointer text-gray-700 opacity-80 transition-all hover:opacity-100"
					style={{
						background: `radial-gradient(circle at 50% 50%, white 0%, white 50%, rgba(0, 0, 0, 0) 50%)`,
					}}
				/>
			)}

			{showScroll && (
				<FaCircleChevronRight
					onClick={scrollNext}
					className="absolute right-0 z-10 cursor-pointer text-gray-700 opacity-80 transition-all hover:opacity-100"
					style={{
						background: `radial-gradient(circle at 50% 50%, white 0%, white 50%, rgba(0, 0, 0, 0) 50%)`,
					}}
				/>
			)}
		</div>
	);
};

export default Carousel;
