import ModeContext, { Mode } from "@/context/ModeProvider";
import useMode from "@/hooks/useMode";
import React, { useContext } from "react";

const ChangeMode: React.FC = () => {
	const { mode, changeMode } = useMode();

	const handleModeChange = (mode: Mode) => {
		console.log("change mode called");
		changeMode(mode);
	};

	return (
		<div className="my-1">
			{mode == "buyer" ? (
				<div>
					<button className="outline-btn" onClick={() => handleModeChange("seller")}>
						Switch to Selling
					</button>
				</div>
			) : (
				<div>
					<button className="outline-btn" onClick={() => handleModeChange("buyer")}>
						Switch to Buying
					</button>
				</div>
			)}
		</div>
	);
};

export default ChangeMode;
