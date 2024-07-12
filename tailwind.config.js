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
		},
	},
	plugins: [require("tailwind-scrollbar")],
};
