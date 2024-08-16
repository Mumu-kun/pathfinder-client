import ThemeContext from "@/context/ThemeProvider";
import React, { useContext } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

const ChangeTheme: React.FC = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);

	return (
		<button className="relative my-1 text-sm font-semibold capitalize" onClick={toggleTheme}>
			<div className="flex items-center px-4 py-1.5 opacity-0">
				Switch To {theme} {theme === "light" ? <IoMoon /> : <IoSunny />}
			</div>
			<div
				className={`absolute inset-0 flex items-center justify-center gap-1 rounded-md border-dark-bg bg-light-bg text-light-text ${theme === "light" ? "border-2 opacity-100" : "z-10 opacity-0 hover:opacity-100"} transition-all`}
			>
				{theme === "dark" && "Switch to"} Light <IoSunny />
			</div>
			<div
				className={`absolute inset-0 flex items-center justify-center gap-1 rounded-md border-light-bg bg-dark-bg text-dark-text ${theme === "dark" ? "border-2 opacity-100" : "z-10 opacity-0 hover:opacity-100"} transition-all`}
			>
				{theme === "light" && "Switch to"} Dark <IoMoon />
			</div>
		</button>
	);
};

export default ChangeTheme;
