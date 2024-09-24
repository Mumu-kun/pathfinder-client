import SearchBar from "@/components/header/SearchBar";
import React from "react";
import IntroImage from "@/assets/introImage.png";

const Intro: React.FC = () => {
	return (
		<div className="m-[5%]">
			<div className="flex flex-col items-center justify-between md:flex-row">
				<div className="relative flex items-center self-stretch bg-light-secondary md:w-1/2 dark:bg-dark-secondary">
					<div className="rounded-l-lg py-10 pl-[5%] pr-20 max-md:px-16 max-md:pb-0">
						<p className="large-headings max-xl:medium-headings max-lg:small-headings max-md:large-headings px-2 !text-left">
							Find yourself the perfect mentor based on your interests and goals.
						</p>
						<SearchBar className="mt-4" />
					</div>

					<div className="absolute -right-2 top-0 h-full w-16 bg-light-bg [clip-path:polygon(0_100%,87.5%_0,100%_0,100%_100%)] max-md:hidden dark:bg-dark-bg"></div>
				</div>

				<div className="max-md:bg-light-secondary md:w-1/2 max-md:dark:bg-dark-secondary">
					<div className="flex items-center justify-center">
						<img src={IntroImage} className="" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Intro;
