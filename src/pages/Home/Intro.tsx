import React from "react";
import ThemeBtn from "../../components/ChangeTheme";

const Intro: React.FC = () => {
	return (
		<div className="m-20">
			<div className="flex items-center justify-between rounded-lg secondary-color">
				<div className="w-1/2">
					<p className="large-headings text-left rounded-l-lg p-20">
						Find yourself the perfect mentor based on your interests and goals.
					</p>
				</div>
				<div className="w-1/2">
					<p className="large-headings">Some image.</p>
				</div>
			</div>
            <ThemeBtn />
		</div>
	);
};

export default Intro;
