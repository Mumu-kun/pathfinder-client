import React from "react";

const Intro: React.FC = () => {
	return (
		<div className="m-20">
			<div className="flex items-center justify-between">
				<div className="w-1/2 secondary-color-bg relative overflow-hidden -z-10">
					<p className="large-headings anton-sc-regular rounded-l-lg p-20 text-left">
						Find yourself the perfect mentor based on your interests and goals.
					</p>
					<div className="absolute -right-2 top-0 h-full w-16 bg-color-bg [clip-path:polygon(0_100%,87.5%_0,100%_0,100%_100%)] max-lg:hidden"></div>
				</div>
				
				<div className="w-1/2">
					<p className="large-headings">Some image.</p>
				</div>
			</div>
			<p className="anton-regular p-10 text-2xl">Font test: The sun goes down, the stars come out. </p>
		</div>
	);
};

export default Intro;
