import React from "react";

const Intro: React.FC = () => {
	return (
		<div className="m-20">
			<div className="secondary-color-bg flex items-center justify-between rounded-lg">
				<div className="w-1/2">
					<p className="large-headings rounded-l-lg p-20 text-left">
						Find yourself the perfect mentor based on your interests and goals.
					</p>
				</div>
				<div className="w-1/2">
					<p className="large-headings">Some image.</p>
				</div>
			</div>
		</div>
	);
};

export default Intro;
