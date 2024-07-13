/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "selector",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			height: {
				headerHeight: "6rem",
			},
			dropShadow: {
				glow: ["0 0px 1px rgba(29,78, 216, 0.35)", "0 0px 3px rgba(29, 78,216, 0.2)"],
			},
			colors: {
				light: {
					text: "#1f1f1f",
					bg: "#f5f5f5",
					secondary: "#e0e0e0",
				},
				dark: {
					text: "#eeeeee",
					bg: "#000000",
					secondary: "#171717",
				},
				prim: {
					50: "#effafc",
					100: "#d6f2f7",
					200: "#b2e4ef",
					300: "#7ed0e2",
					400: "#38aecc",
					500: "#2695b4",
					600: "#227998",
					700: "#22637c",
					800: "#245166",
					900: "#224557",
					950: "#112c3b",
				},
				sec: {
					50: "#eff8ff",
					100: "#def0ff",
					200: "#b5e2ff",
					300: "#74cdff",
					400: "#2bb5ff",
					500: "#009bf8",
					600: "#007bd4",
					700: "#0061ac",
					800: "#00538e",
					900: "#054575",
					950: "#02182b",
				},
			},
		},
	},
	plugins: [require("tailwind-scrollbar")],
};
