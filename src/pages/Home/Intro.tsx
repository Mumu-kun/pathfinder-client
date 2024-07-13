import React from "react";

const Intro: React.FC = () => {
	return (
		<div className="m-[5%]">
			<div className="flex flex-col items-center justify-between md:flex-row">
				<div className="bg-light-secondary dark:bg-dark-secondary relative -z-10 w-1/2 overflow-hidden">
					<p className="large-headings anton-sc-regular rounded-l-lg p-[15%] text-left">
						Find yourself the perfect mentor based on your interests and goals.
					</p>
					<div className="bg-light-bg dark:bg-dark-bg absolute -right-2 top-0 h-full w-16 [clip-path:polygon(0_100%,87.5%_0,100%_0,100%_100%)] max-md:hidden"></div>
				</div>

				<div className="w-1/2">
					<div className="flex items-center justify-center">
						<img src="/pathFinder-home.webp" className="max-h-[350px]"></img>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Intro;
