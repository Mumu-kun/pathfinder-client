import { createContext, FC, ReactNode, useEffect, useState } from "react";

export type Theme = "light" | "dark";

type ThemeContextProps = {
	theme: Theme;
	changeTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextProps>({
	theme: "light",
	changeTheme: (theme) => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const savedTheme = localStorage.getItem("theme") as Theme | null;

	const [theme, setTheme] = useState<Theme>(savedTheme || "light");

	const changeTheme = (theme: Theme) => {
		console.log("theme changed");

		localStorage.setItem("theme", theme);

		setTheme(theme);
	};

	useEffect(() => {
		document.body.classList.remove("light", "dark");
		document.body.classList.add(theme);
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
