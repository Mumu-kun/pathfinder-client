import React, { useEffect, useState } from "react";

const ChangeTheme: React.FC = () => {
	const [theme, setTheme] = useState<string | null>(localStorage.getItem("theme"));

	useEffect(() => {
		document.body.classList.remove("light", "dark");
		if (theme !== "" && theme !== null) {
			document.body.classList.add(theme);
		}
	}, [theme]);

	const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		console.log("theme changed");
		localStorage.setItem("theme", e.currentTarget.value);
		setTheme(localStorage.getItem("theme"));
	};
	return (
		<div>
			<select onChange={handleThemeChange} className="form-1" aria-label="Default select example">
				{theme && <option value={theme}>{theme.toUpperCase()}</option>}
				{!theme && <option value="">THEME</option>}
				<option value="light">LIGHT</option>
				<option value="dark">DARK</option>
			</select>
		</div>
	);
};

export default ChangeTheme;
