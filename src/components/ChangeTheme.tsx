import ThemeContext, { Theme } from "@/context/ThemeProvide";
import React, { useContext } from "react";

const ChangeTheme: React.FC = () => {
	const { theme, changeTheme } = useContext(ThemeContext);

	const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		changeTheme(e.currentTarget.value as Theme);
	};

	return (
		<div>
			<select
				onChange={handleThemeChange}
				className="form-1 text-xs"
				aria-label="Default select example"
				defaultValue={theme}
			>
				{!theme && <option value="">THEME</option>}
				<option value="light">LIGHT</option>
				<option value="dark">DARK</option>
			</select>
		</div>
	);
};

export default ChangeTheme;
