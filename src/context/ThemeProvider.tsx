import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export type Theme = "light" | "dark";

type ThemeContextProps = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps>({
	theme: "light",
	toggleTheme: () => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [savedTheme, setSavedTheme] = useLocalStorage<Theme>("theme", "light");

	const [theme, setTheme] = useState<Theme>(savedTheme);

	const toggleTheme = () => {
		console.log("theme changed");
		const newTheme = theme === "light" ? "dark" : "light";
		setSavedTheme(newTheme);
		setTheme(newTheme);
	};

	useEffect(() => {
		document.body.classList.remove("light", "dark");
		document.body.classList.add(theme);
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
