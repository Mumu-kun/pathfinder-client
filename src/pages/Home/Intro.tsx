import SearchBar from "@/components/header/SearchBar";
import React from "react";

const Intro: React.FC = () => {
	return (
		<div className="m-[5%]">
			<div className="flex flex-col items-center justify-between md:flex-row">
				<div className="relative z-0 bg-light-secondary md:w-1/2 dark:bg-dark-secondary">
					<div className="rounded-l-lg p-[15%]">
						<p className="large-headings anton-sc-regular text-left">
							Find yourself the perfect mentor based on your interests and goals.
						</p>
						<SearchBar className="mt-4" />
					</div>

					<div className="absolute -right-2 top-0 h-full w-16 bg-light-bg [clip-path:polygon(0_100%,87.5%_0,100%_0,100%_100%)] max-md:hidden dark:bg-dark-bg"></div>
				</div>

				<div className="md:w-1/2">
					<div className="flex items-center justify-center">
						<img src="/pathFinder-home.webp" className="max-h-[350px]"></img>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Intro;
